/**
 * Generates a secure random password
 * @param length Password length (default: 12)
 * @param includeUppercase Include uppercase letters (default: true)
 * @param includeLowercase Include lowercase letters (default: true)
 * @param includeNumbers Include numbers (default: true)
 * @param includeSpecial Include special characters (default: true)
 * @returns Generated password string
 */
export function generateSecurePassword(
  length = 12,
  includeUppercase = true,
  includeLowercase = true,
  includeNumbers = true,
  includeSpecial = true,
): string {
  // Character sets
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Create character pool based on options
  let charPool = "";
  if (includeUppercase) charPool += uppercaseChars;
  if (includeLowercase) charPool += lowercaseChars;
  if (includeNumbers) charPool += numberChars;
  if (includeSpecial) charPool += specialChars;

  // Ensure at least one character set is selected
  if (charPool.length === 0) {
    charPool = lowercaseChars + numberChars;
  }

  // Generate the password
  let password = "";

  // Ensure we include at least one character from each selected character set
  if (includeUppercase) {
    password += uppercaseChars.charAt(
      Math.floor(Math.random() * uppercaseChars.length),
    );
  }
  if (includeLowercase) {
    password += lowercaseChars.charAt(
      Math.floor(Math.random() * lowercaseChars.length),
    );
  }
  if (includeNumbers) {
    password += numberChars.charAt(
      Math.floor(Math.random() * numberChars.length),
    );
  }
  if (includeSpecial) {
    password += specialChars.charAt(
      Math.floor(Math.random() * specialChars.length),
    );
  }

  // Fill the rest of the password with random characters from the pool
  const remainingLength = Math.max(0, length - password.length);
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * charPool.length);
    password += charPool.charAt(randomIndex);
  }

  // Shuffle the password characters to avoid predictable patterns
  return shuffleString(password);
}

/**
 * Shuffles the characters in a string
 * @param str String to shuffle
 * @returns Shuffled string
 */
function shuffleString(str: string): string {
  const array = str.split("");

  // Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }

  return array.join("");
}
