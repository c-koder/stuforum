import zxcvbn from "zxcvbn";

const PasswordStrengthMeter = ({ password }) => {
  const testedResult = zxcvbn(password);

  const createPasswordLabel = (result) => {
    switch (result.score) {
      case 0:
        return "Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "Weak";
    }
  };

  return (
    <div className="password-strength-meter" style={{ color: "var(--dark)" }}>
      <progress
        className={`password-strength-meter-progress strength-${createPasswordLabel(
          testedResult
        )}`}
        value={testedResult.score}
        max="4"
      />
    </div>
  );
};

export default PasswordStrengthMeter;
