const form = document.querySelector("#fuel-form");
const distanceInput = document.querySelector("#distance");
const fuelInput = document.querySelector("#fuel");
const tankSizeInput = document.querySelector("#tank-size");
const errorMessage = document.querySelector("#form-error");
const resultEmpty = document.querySelector("#result-empty");
const resultContent = document.querySelector("#result-content");
const efficiencyResult = document.querySelector("#efficiency-result");
const rangeResult = document.querySelector("#range-result");
const resultMessage = document.querySelector("#result-message");
const resetButton = document.querySelector("#reset-button");

const inputs = [distanceInput, fuelInput, tankSizeInput];

function clearErrors() {
  errorMessage.textContent = "";
  inputs.forEach((input) => {
    input.removeAttribute("aria-invalid");
    input.closest(".input-wrap").classList.remove("has-error");
  });
}

function showError(input, message) {
  errorMessage.textContent = message;
  input.setAttribute("aria-invalid", "true");
  input.closest(".input-wrap").classList.add("has-error");
  input.focus();
}

function getMessage(efficiency) {
  if (efficiency >= 18) return "Exceptionally efficient — your car is making every litre count.";
  if (efficiency >= 13) return "Looking efficient. That tank is taking you a healthy distance.";
  if (efficiency >= 9) return "A solid everyday result for a mixed city and highway drive.";
  return "A thirstier result. Traffic, tyre pressure and driving style may all play a part.";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const distance = Number(distanceInput.value);
  const fuel = Number(fuelInput.value);
  const tankSize = Number(tankSizeInput.value);

  if (!Number.isFinite(distance) || distance <= 0) {
    showError(distanceInput, "Enter a distance greater than zero.");
    return;
  }

  if (!Number.isFinite(fuel) || fuel <= 0) {
    showError(fuelInput, "Enter the amount of fuel you added.");
    return;
  }

  if (!Number.isFinite(tankSize) || tankSize <= 0) {
    showError(tankSizeInput, "Enter your vehicle's tank size.");
    return;
  }

  if (fuel > tankSize) {
    showError(fuelInput, "Fuel added cannot be greater than your tank size.");
    return;
  }

  const efficiency = distance / fuel;
  const estimatedRange = efficiency * tankSize;

  efficiencyResult.textContent = efficiency.toFixed(1);
  rangeResult.textContent = Math.round(estimatedRange).toLocaleString();
  resultMessage.textContent = getMessage(efficiency);

  resultEmpty.hidden = true;
  resultContent.hidden = false;
  resultContent.classList.remove("is-visible");
  requestAnimationFrame(() => resultContent.classList.add("is-visible"));

  if (window.innerWidth <= 900) {
    document.querySelector("#result-card").scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

inputs.forEach((input) => {
  input.addEventListener("input", clearErrors);
});

resetButton.addEventListener("click", () => {
  form.reset();
  clearErrors();
  resultContent.hidden = true;
  resultContent.classList.remove("is-visible");
  resultEmpty.hidden = false;
  distanceInput.focus();
});
