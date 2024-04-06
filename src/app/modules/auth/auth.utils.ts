import bcrypt from "bcrypt";
import AppError from "../../../helper/errorHelper/appError";

type TPasswordHistory = {
  id: string;
  userId: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

const comparePasswordWithLastThreePasswords = async (
  newPassword: string,
  passwordHistory: TPasswordHistory[]
) => {
  for (const password of passwordHistory) {
    const isMatch = await bcrypt.compare(newPassword, password.password);

    //format date in this format: 2021-08-01 at 11:00 PM
    const formatDate = new Date(password.createdAt).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    if (isMatch) {
      throw new AppError(
        `You have used this password on ${formatDate}. Please use a different password.`,
        400
      );
    }
  }
};

export default comparePasswordWithLastThreePasswords;
