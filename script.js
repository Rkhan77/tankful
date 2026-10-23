const form = document.querySelector("#fuel-form");
const distanceInput = document.querySelector("#distance");
const fuelInput = document.querySelector("#fuel");
const tankSizeInput = document.querySelector("#tank-size");
const errorMessage = document.querySelector("#form-error");
const resultEmpty = document.querySelector("#result-empty");
const resultContent = document.querySelector("#result-content");
const efficiencyResult = document.querySelector("#efficiency-result");
const consumptionResult = document.querySelector("#consumption-result");
const rangeResult = document.querySelector("#range-result");
const resultMessage = document.querySelector("#result-message");
const ratingBadge = document.querySelector("#rating-badge");
const scaleMarker = document.querySelector("#scale-marker");
const resultCard = document.querySelector("#result-card");
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

function getRating(efficiency) {
  if (efficiency >= 17) {
    return {
      key: "excellent",
      label: "Excellent",
      advice: "Keep doing what works. Confirm the result over a few tanks, and maintain correct tyre pressure to protect it."
    };
  }

  if (efficiency >= 12) {
    return {
      key: "efficient",
      label: "Efficient",
      advice: "A strong result. Smooth acceleration, sensible speeds and combining short trips can help you hold it."
    };
  }

  if (efficiency >= 8) {
    return {
      key: "typical",
      label: "Typical",
      advice: "Try smoother acceleration and braking, avoid long idling, and remove unused roof racks or heavy cargo."
    };
  }

  return {
    key: "thirsty",
    label: "Thirsty",
    advice: "Check tyre pressure and your car's official rating. If economy has dropped suddenly, book a maintenance check."
  };
}

function getMarkerPosition(efficiency) {
  const minimum = 5;
  const maximum = 22;
  const position = ((efficiency - minimum) / (maximum - minimum)) * 100;
  return Math.min(98, Math.max(2, position));
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
  const litresPerHundred = 100 / efficiency;
  const estimatedRange = efficiency * tankSize;
  const rating = getRating(efficiency);

  efficiencyResult.textContent = efficiency.toFixed(1);
  consumptionResult.textContent = litresPerHundred.toFixed(1);
  rangeResult.textContent = Math.round(estimatedRange).toLocaleString();
  resultMessage.textContent = rating.advice;
  ratingBadge.textContent = rating.label;
  resultCard.dataset.rating = rating.key;
  scaleMarker.style.left = `${getMarkerPosition(efficiency)}%`;

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
  resultCard.removeAttribute("data-rating");
  resultEmpty.hidden = false;
  distanceInput.focus();
});
