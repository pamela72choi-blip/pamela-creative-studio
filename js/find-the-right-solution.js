const solutionForm = document.querySelector("[data-solution-form]");

if (solutionForm) {
  const steps = [...solutionForm.querySelectorAll("[data-step]")];
  const progressItems = [...document.querySelectorAll(".solution-progress li")];
  const progressBar = document.querySelector("[data-progress-bar]");
  const progressText = document.querySelector(".solution-progress__text");
  const previousButton = solutionForm.querySelector("[data-previous]");
  const nextButton = solutionForm.querySelector("[data-next]");
  const submitButton = solutionForm.querySelector("[data-submit]");
  const status = solutionForm.querySelector("[data-form-status]");
  const success = document.querySelector("[data-form-success]");
  const restartButton = document.querySelector("[data-form-restart]");
  let currentStep = 0;

  const showStep = (index, focus = true) => {
    currentStep = index;
    steps.forEach((step, stepIndex) => { step.hidden = stepIndex !== index; });
    progressItems.forEach((item, itemIndex) => {
      item.classList.toggle("is-current", itemIndex === index);
      item.classList.toggle("is-complete", itemIndex < index);
    });
    progressBar.style.width = `${(index / (steps.length - 1)) * 100}%`;
    progressText.textContent = `Step ${index + 1} / ${steps.length}`;
    previousButton.hidden = index === 0;
    nextButton.hidden = index === steps.length - 1;
    submitButton.hidden = index !== steps.length - 1;
    status.textContent = "";
    if (focus) steps[index].querySelector("legend")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateStep = () => {
    const step = steps[currentStep];
    const invalidField = step.querySelector(":invalid");
    if (invalidField) {
      invalidField.reportValidity();
      return false;
    }

    const requiredGroup = step.querySelector("[data-required-group]");
    if (requiredGroup) {
      const name = requiredGroup.dataset.requiredGroup;
      const hasSelection = step.querySelectorAll(`input[name="${name}"]:checked`).length > 0;
      const error = step.querySelector("[data-group-error]");
      error.hidden = hasSelection;
      requiredGroup.classList.toggle("has-error", !hasSelection);
      if (!hasSelection) return false;
    }
    return true;
  };

  solutionForm.querySelectorAll("[data-required-group] input").forEach((input) => {
    input.addEventListener("change", () => {
      const step = input.closest("[data-step]");
      step.querySelector("[data-group-error]").hidden = true;
      input.closest("[data-required-group]").classList.remove("has-error");
    });
  });

  solutionForm.querySelectorAll("[data-other-toggle]").forEach((toggle) => {
    const target = solutionForm.querySelector(`[data-other-input="${toggle.dataset.otherToggle}"]`);
    const sync = () => {
      target.disabled = !toggle.checked;
      target.required = toggle.checked;
      if (!toggle.checked) target.value = "";
    };
    toggle.addEventListener("change", () => {
      sync();
      if (toggle.checked) target.focus();
    });
    sync();
  });

  previousButton.addEventListener("click", () => showStep(Math.max(0, currentStep - 1)));
  nextButton.addEventListener("click", () => {
    if (validateStep()) showStep(Math.min(steps.length - 1, currentStep + 1));
  });

  solutionForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateStep()) return;

    const endpoint = solutionForm.dataset.formEndpoint;
    if (!endpoint) {
      status.textContent = "表單連線尚在設定中，請稍後再試或直接來信聯絡。";
      status.className = "solution-form__status is-error";
      return;
    }

    const data = new FormData(solutionForm);
    const payload = new URLSearchParams({
      problem: data.get("problem") || "",
      brandName: data.get("brandName") || "",
      industry: data.get("industry") || "",
      offering: data.get("offering") || "",
      officialWebsite: data.get("officialWebsite") || "",
      socialMethods: data.getAll("socialMethods").join("、"),
      socialOther: data.get("socialOther") || "",
      salesMethods: data.getAll("salesMethods").join("、"),
      services: data.getAll("services").join("、"),
      serviceOther: data.get("serviceOther") || "",
      budget: data.get("budget") || "",
      name: data.get("name") || "",
      email: data.get("email") || "",
      line: data.get("line") || "",
      phone: data.get("phone") || "",
      sourcePage: window.location.href,
      website: data.get("website") || "",
    });

    submitButton.disabled = true;
    submitButton.textContent = "送出中…";
    status.textContent = "正在安全送出資料，請稍候。";
    status.className = "solution-form__status";

    try {
      await fetch(endpoint, { method: "POST", mode: "no-cors", body: payload });
      solutionForm.hidden = true;
      success.hidden = false;
      success.focus();
      solutionForm.reset();
      solutionForm.querySelectorAll("[data-other-toggle]").forEach((toggle) => toggle.dispatchEvent(new Event("change")));
    } catch (error) {
      status.textContent = "目前無法送出，請稍後再試，或直接寄信至 pamela72choi@gmail.com。";
      status.className = "solution-form__status is-error";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "送出需求";
    }
  });

  restartButton.addEventListener("click", () => {
    success.hidden = true;
    solutionForm.hidden = false;
    showStep(0);
  });

  showStep(0, false);
}
