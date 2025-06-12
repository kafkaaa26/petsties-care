import { BadRequestException, Injectable } from '@nestjs/common';
import { CommonService } from '@core/services/common.service';
import { Logger } from '@core/decorators/logger.decorator';
import { logger } from '@core/models/logger';
import nodemailer from 'nodemailer';
import { config } from '@core/config/app.config';
import { ReservationRequest } from '../models/reservation.request';
import { ReservationEntity } from '@entities/reservation.entity';
import moment from 'moment';
import { ReservationRepository } from '@repositories/reservation.repository';
import { ClinicRepository } from '@repositories/clinic.repository';
import { ClinicEntity } from '@entities/clinic.entity';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly clinicRepository: ClinicRepository,
    private readonly commonService: CommonService,
  ) {}

  @Logger()
  async create(request: ReservationRequest): Promise<any> {
    try {
      if (request.email) {
        const emailRegex =
          /^[^\s@.',][^\s@,]*(?:\.[^\s@,]+)*@[^\s@]+(?:\.com|(?:\.[^\s@]+)*\.com(?:\.[^\s@]+)*)$/;

        if (!emailRegex.test(request.email)) {
          throw new BadRequestException(
            this.commonService.translate('common.INVALID_EMAIL'),
          );
        }
      }

      const clinicId = request.clinicId;
      if (!clinicId) {
        throw new Error('Clinic ID is required for creating a reservation.');
      }

      const clinic = await this.clinicRepository.findOne({
        where: { clinicId, isDeleted: false },
      });

      if (!clinic) {
        throw new Error('Clinic not found or has been deleted.');
      }

      const newReservation = new ReservationEntity();

      const now = moment().unix();

      newReservation.petType = request.petType;
      newReservation.serviceType = request.serviceType;
      newReservation.petState = request.petState || '';
      newReservation.userName = request.userName;
      newReservation.email = request.email || '';
      newReservation.phoneNumber = request.phoneNumber;
      newReservation.address = request.address || '';
      newReservation.dateReservation = request.dateReservation;
      newReservation.clinicId = request.clinicId;
      newReservation.createdAt = now;
      newReservation.updatedAt = now;

      const response = await this.reservationRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const savedReservation =
            await transactionalEntityManager.save(newReservation);
          await transactionalEntityManager.update(
            ClinicEntity,
            { clinicId },
            { reservationCount: () => 'reservationCount + 1' },
          );

          const no = this.genNo(savedReservation.id, savedReservation.clinicId);

          // savedReservation.email &&
          //   (await this.sendReservationInfoEmail(savedReservation, clinic, no));
          logger.log(`Successfully sent email to ${savedReservation.email}`);

          return {
            ...savedReservation,
            no,
            clinicName: clinic.clinicName,
            clinicAddress: clinic.clinicAddress,
            clinicPhone: clinic.clinicPhone,
          };
        },
      );

      logger.log('User created successfully:', response);
      return response;
    } catch (error) {
      logger.error('Error during reservation creation:', error);
      if (error instanceof BadRequestException) {
        throw error; // Re-throw BadRequestException
      }

      throw new BadRequestException(
        this.commonService.translate('common.ERROR_CREATING_RESERVATION'),
      );
    }
  }

  async sendReservationInfoEmail(
    reservation: ReservationEntity,
    clinic: ClinicEntity,
    no: string,
  ): Promise<void> {
    const { email, userName, phoneNumber, address, dateReservation } =
      reservation;

    const { clinicName, clinicAddress, clinicPhone } = clinic;

    try {
      // Create email transporter with SES SMTP
      const transporter = nodemailer.createTransport({
        host: config.aws.ses.host,
        port: config.aws.ses.port,
        secure: config.aws.ses.secure,
        auth: {
          user: config.aws.ses.auth.user,
          pass: config.aws.ses.auth.pass,
        },
        debug: true,
      });

      // Nội dung email
      const mailOptions = {
        from: config.aws.ses.fromAddress,
        to: email,
        // cc: config.aws.ses.fromAddress,
        subject: 'Xác nhận lịch hẹn khám thú cưng - Petstie Care',
        text: `
          Chào ${userName},
          
          Bạn đã đặt lịch khám thành công tại ${clinicName}. Dưới đây là thông tin chi tiết:
          
          🔹 Thông tin khách hàng:
          - Họ tên: ${userName}
          - Số điện thoại: ${phoneNumber}
          - Địa chỉ: ${address}
          
          🔹 Thông tin lịch hẹn:
          - Mã đặt lịch: ${no}
          - Ngày hẹn: ${dateReservation}
          - Phòng khám: ${clinicName}
          - Địa chỉ: ${clinicAddress}
          - Hotline: ${clinicPhone}
          
          📌 Lưu ý:
          - Vui lòng đến đúng giờ để được phục vụ tốt nhất.
          - Nếu có thay đổi, hãy liên hệ với phòng khám trước 5 giờ để điều chỉnh lịch hẹn.
          
          Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi!
          
          Trân trọng,
          Petstie Care
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
            <!-- LOGO CĂN GIỮA -->
            <div style="text-align: center; margin-bottom: 20px;">
              <img src=${config.logoUrl} alt="Petstie Care Logo" style="max-width: 200px; height: auto;" />
            </div>

            <h2 style="color: #2E86C1;">Đặt lịch thành công!</h2>
            <p>Chào <strong>${userName}</strong>,</p>
            <p>Bạn đã đặt lịch khám thành công tại <strong>${clinicName}.</strong> Dưới đây là thông tin chi tiết:</p>

            <div style="margin-top: 20px;">
              <h3>🔹 Thông tin khách hàng:</h3>
              <ul>
                <li><strong>Họ tên:</strong> ${userName}</li>
                <li><strong>Số điện thoại:</strong> ${phoneNumber}</li>
                <li><strong>Địa chỉ:</strong> ${address}</li>
              </ul>
            </div>
            <div style="margin-top: 20px;">
              <h3>🔹 Thông tin lịch hẹn:</h3>
              <ul>
                <li><strong>Mã đặt lịch:</strong> ${no}</li>
                <li><strong>Ngày hẹn:</strong> ${dateReservation}</li>
                <li><strong>Phòng khám:</strong> ${clinicName}</li>
                <li><strong>Địa chỉ:</strong> ${clinicAddress}</li>
                <li><strong>Hotline:</strong> ${clinicPhone}</li>
              </ul>
            </div>

            <div style="margin-top: 20px; color: #555;">
              <p><strong>Lưu ý:</strong></p>
              <ul>
                <li>Vui lòng đến đúng giờ để được phục vụ tốt nhất.</li>
                <li>Nếu có thay đổi, hãy liên hệ với phòng khám trước 5 giờ để điều chỉnh lịch hẹn.</li>
              </ul>
            </div>
            <p style="margin-top: 30px;">Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi!</p>
            <p>Trân trọng,<br/>Petstie Care</p>
          </div>
        `,
      };

      // Gửi email
      logger.log(`Attempting to send email to ${email}`);
      try {
        const info = await transporter.sendMail(mailOptions);
        logger.log(`Email sent to ${email}: ${info.response}`);
      } catch (error) {
        logger.error(`Error sending email to ${email}:`, error);
        if (error.response && error.response.includes('not verified')) {
          throw new BadRequestException(
            `Email address ${email} is not verified in SES. Please verify the email address.`,
          );
        } else {
          throw new BadRequestException(
            `Failed to send email to ${email}: ${error.message}`,
          );
        }
      }
    } catch (error) {
      throw error;
    }
  }

  genNo(reservationId: number, clinicId: string): string {
    const clinicPrefix = clinicId.slice(0, 2).toUpperCase();
    const reservationSuffix = reservationId.toString().padStart(4, '0');
    return `STT${clinicPrefix}${reservationSuffix}`;
  }
}
