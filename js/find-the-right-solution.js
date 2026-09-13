// Website recommendations are independent of existing non-website services.
function getWebsiteRecommendation(data) {
  const purposes = data.getAll("websitePurpose");
  if (!purposes.length) return null;
  const features = data.getAll("websiteFeatures");
  const complex = ["會員系統", "大量資料／特殊查詢", "複雜報名流程", "API／特殊後台", "大型活動"];
  const plans = {
    landing: ["一頁式網站", "NT$ 18,000 起", 18000, 1],
    brand: ["品牌形象官網", "NT$ 35,000 起", 35000, 2],
    products: ["商品展示／電商導購網站", "NT$ 38,000 起", 38000, 3],
    booking: ["課程／預約型網站", "NT$ 40,000 起", 40000, 4],
    event: ["活動／報名網站", "NT$ 30,000 起", 30000, 5],
    custom: ["客製功能網站", "依需求評估", null, 6],
  };
  const functional = purposes.filter(p => ["products", "booking", "event"].includes(p));
  let key = purposes.includes("custom") || features.some(f => complex.includes(f)) || functional.length > 1
    ? "custom" : functional[0] || (purposes.includes("brand") ? "brand" : purposes.includes("landing") ? "landing" : null);
  if (!key) return { title: "先聊聊網站需求", price: "依需求評估", id: 6,
    notes: ["先釐清網站用途、預算與日後維護方式，再選擇適合的方案。"] };
  const [title, price, minimum, id] = plans[key];
  const notes = [];
  if (key === "landing") notes.push("適合單一品牌、服務或活動宣傳頁；需要場次、報名或成果公布時，建議評估活動／報名網站。");
  if (key === "brand") notes.push("以品牌形象與資訊展示為主；銷售、預約、報名與付款等功能另行評估。");
  if (purposes.includes("products")) {
    const platforms = data.getAll("commercePlatforms").filter(p => !["尚未建立", "不適用"].includes(p));
    notes.push(platforms.length ? "可優先整合既有通路（" + platforms.join("、") + "），由網站呈現品牌與商品，導流至商城／LINE。" : "可規劃品牌官網＋商品展示＋商城導購，先評估適合的成熟電商平台。");
    notes.push("完整購物功能依平台與需求另行報價，不包含在導購網站起價內。");
  }
  if (purposes.includes("booking")) notes.push("可規劃課程、時段、報名表單與預約入口；預約、付款、會員或課程管理功能，依實際平台與流程另外評估。");
  if (purposes.includes("event")) {
    notes.push("依活動流程規劃宣傳、報名入口與資訊；場次、名單、賽程、結果公布、成果頁或付款等延伸項目另行評估。");
    if (data.getAll("eventNeeds").includes("宗教法會／功德項目／流程公告")) notes.push("法會可規劃介紹、日期場次、功德項目、報名方式、流程與公告。");
  }
  if (data.get("commerceFlow") === "onsite" || features.includes("金流／訂單／物流／優惠券")) notes.push("官網購物車、金流、會員、訂單、物流或優惠券，需先確認平台與需求，再另行報價。");
  if (key === "custom") notes.push("多種功能整合或特殊需求需先評估使用情境、平台、第三方服務與維護方式；如需專業工程開發，可採合作工程師或另外評估。");
  if (features.includes("多語系")) notes.push("多語系網站：原網站費用＋20% 起。");
  const budgetCeiling = { "3000 以下": 3000, "3000～8000": 8000, "8000～15000": 15000, "15000～30000": 30000 };
  if (minimum && budgetCeiling[data.get("budget")] < minimum) notes.push("目前預算低於此方案基本起價，可先討論分階段製作或調整範圍；不代表能以此預算完成全部功能。");
  notes.push("以上為基本參考，依實際需求、內容量與功能另行評估；平台、主機、網域及第三方服務等外部費用另計。");
  return { title, price, id, notes };
}

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
  const websiteQuestions = solutionForm.querySelector("[data-website-questions]");
  const websiteRecommendation = solutionForm.querySelector("[data-website-recommendation]");
  const websiteError = solutionForm.querySelector("[data-website-error]");
  const websiteProblems = ["官網不好看", "建立網站／單頁宣傳", "商品展示／商城導購", "課程／服務預約", "活動／報名資訊"];
  const websiteServices = ["網站", "商品展示／電商導購網站", "課程／預約型網站", "活動／報名網站"];

  const renderWebsiteRecommendation = () => {
    const result = getWebsiteRecommendation(new FormData(solutionForm));
    websiteRecommendation.replaceChildren();
    websiteRecommendation.hidden = !result;
    const review = solutionForm.querySelector("[data-website-review]");
    review.replaceChildren();
    review.hidden = !result;
    if (!result) return;
    const heading = document.createElement("strong");
    heading.textContent = "建議方向：" + result.title + "｜" + result.price;
    websiteRecommendation.append(heading);
    result.notes.forEach(note => {
      const paragraph = document.createElement("p");
      paragraph.textContent = note;
      websiteRecommendation.append(paragraph);
    });
    const link = document.createElement("a");
    link.href = "service-pricing.html#website-plan-" + result.id;
    link.textContent = "查看網站方案與報價";
    websiteRecommendation.append(link);
    review.append(...[...websiteRecommendation.childNodes].map(node => node.cloneNode(true)));
  };

  const syncWebsiteQuestions = () => {
    const data = new FormData(solutionForm);
    const active = websiteProblems.includes(data.get("problem")) || data.getAll("services").some(s => websiteServices.includes(s));
    websiteQuestions.hidden = !active;
    websiteQuestions.disabled = !active;
    const purposes = active ? data.getAll("websitePurpose") : [];
    websiteQuestions.querySelectorAll("[data-website-detail]").forEach(group => {
      const relevant = purposes.includes(group.dataset.websiteDetail) || purposes.includes("custom");
      group.hidden = !relevant;
      group.querySelectorAll("input").forEach(input => { input.disabled = !relevant; });
    });
    if (purposes.length || !active) websiteError.hidden = true;
    renderWebsiteRecommendation();
  };
  solutionForm.addEventListener("change", syncWebsiteQuestions);
  syncWebsiteQuestions();

  const showStep = (index, focus = true) => {
    currentStep = index;
    syncWebsiteQuestions();
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
    if (step.contains(websiteQuestions) && !websiteQuestions.disabled &&
        !new FormData(solutionForm).getAll("websitePurpose").length) {
      websiteError.hidden = false;
      websiteQuestions.querySelector('input[name="websitePurpose"]').focus();
      return false;
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
    const recommendation = getWebsiteRecommendation(data);
    const websiteSummary = recommendation ? [
      "【網站需求】",
      "用途：" + [...solutionForm.querySelectorAll('input[name="websitePurpose"]:checked')].map(input => input.nextElementSibling.textContent).join("、"),
      ...[["commercePlatforms", "既有通路"], ["commerceFlow", "交易方式"], ["bookingNeeds", "課程／預約"], ["eventNeeds", "活動"], ["websiteFeatures", "延伸功能"], ["websiteNotes", "補充"]].map(([key, label]) => label + "：" + (key === "commerceFlow" ? ({ external: "導流至既有商城／LINE 詢問", onsite: "需要官網購物車、付款或訂單功能", discuss: "想先評估適合的平台" }[data.get(key)] || "") : data.getAll(key).join("、"))),
      "建議：" + recommendation.title + "｜" + recommendation.price,
      ...recommendation.notes,
    ].join("\n") : "";
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
      serviceOther: [data.get("serviceOther") || "", websiteSummary].filter(Boolean).join("\n\n"),
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
