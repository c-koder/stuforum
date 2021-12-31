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
    <div
      className="password-strength-meter"
      style={{ marginLeft: 5, marginTop: -10, color: "var(--gray)" }}
    >
      <progress
        className={`password-strength-meter-progress strength-${createPasswordLabel(
          testedResult
        )}`}
        style={{ marginBottom: 10 }}
        value={testedResult.score}
        max="4"
      />
      <label className="password-strength-meter-label">
        <>
          <strong>Password strength:</strong>{" "}
          {password && createPasswordLabel(testedResult)}
        </>
      </label>
    </div>
  );
};

export default PasswordStrengthMeter;
