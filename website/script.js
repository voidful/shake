const ROUTES = {
    all: {
        label: "產業全景",
        hint: "先看品牌招牌與分類全貌",
        headline: "先從品牌想被記住的味道開始",
        description: "如果你還不知道自己偏茶感、奶感或果感，先用品牌招牌與熱門類型看整體市場，建立第一張手搖地圖。",
        tags: ["品牌招牌", "市場全貌", "先建立基準杯"],
        filter: () => true,
        score: (drink) => {
            let score = 0;
            if (drink.category === "特色招牌類") score += 12;
            if (drink.category === "鮮奶茶類") score += 8;
            if (drink.category === "果汁茶類") score += 7;
            if (drink.price >= 40 && drink.price <= 75) score += 6;
            if (drink.calories_normal <= 520) score += 4;
            score += Math.max(0, 5 - Math.abs(drink.price - 60) / 8);
            return score;
        }
    },
    tea: {
        label: "茶感派",
        hint: "先懂茶底、焙火與熟成",
        headline: "想喝出品牌差異，先從茶底開始",
        description: "純茶與偏茶感的招牌最適合建立基準味覺。先分清楚你喜歡焙火、花香、熟成還是清爽，後面會輕鬆很多。",
        tags: ["純茶", "焙火", "熟成"],
        filter: (drink) => {
            if (drink.category === "純茶類") return true;
            return drink.category === "特色招牌類" && !hasMilkKeyword(drink.name);
        },
        score: (drink) => {
            let score = 0;
            if (drink.category === "純茶類") score += 16;
            if (drink.category === "特色招牌類") score += 8;
            if (drink.calories_nosugar <= 60) score += 10;
            if (/茶|烏龍|紅茶|青茶|金萱|熟成|麥茶|決明|焙/.test(drink.name)) score += 6;
            if (/茶|烏龍|紅茶|熟成|焙|金萱/.test(drink.brandStyle)) score += 4;
            score += Math.max(0, 5 - Math.abs(drink.price - 45) / 7);
            return score;
        }
    },
    milk: {
        label: "奶香派",
        hint: "奶感、厚度與穩定滿足",
        headline: "鮮奶茶、奶茶、奶蓋是最穩的幸福路線",
        description: "如果你在找的是包覆感與滿足感，先看奶茶、鮮奶茶、奶蓋與植物奶延伸款。差別多半藏在茶底厚度與奶體選擇。",
        tags: ["鮮奶茶", "奶茶", "奶蓋"],
        filter: (drink) => ["奶茶類", "鮮奶茶類", "奶蓋茶類", "純植特調"].includes(drink.category),
        score: (drink) => {
            let score = 0;
            if (drink.category === "鮮奶茶類") score += 15;
            if (drink.category === "奶茶類") score += 12;
            if (drink.category === "奶蓋茶類") score += 11;
            if (drink.category === "純植特調") score += 9;
            if (/奶|拿鐵|奶蓋|燕麥/.test(drink.name)) score += 6;
            if (/奶|鮮奶|牧場|厚/.test(drink.brandStyle)) score += 4;
            score += Math.max(0, 6 - Math.abs(drink.price - 68) / 8);
            return score;
        }
    },
    fruit: {
        label: "果茶派",
        hint: "清爽、香氣與季節感",
        headline: "想喝亮一點、輕一點，先看果茶",
        description: "果茶通常是最容易快速喜歡的一條線，重點不只在水果，而是在酸甜與茶感有沒有平衡，會不會越喝越膩。",
        tags: ["果香", "清爽", "不怕膩"],
        filter: (drink) => drink.category === "果汁茶類",
        score: (drink) => {
            let score = 0;
            score += 18;
            if (drink.calories_nosugar <= 150) score += 9;
            if (drink.calories_normal <= 320) score += 6;
            if (drink.price <= 75) score += 5;
            if (/果|柚|檸|莓|芒|桑椹|葡萄|奇異果|蘋果/.test(drink.name)) score += 4;
            return score;
        }
    },
    chewy: {
        label: "咀嚼控",
        hint: "配料就是主角",
        headline: "你可能不是在喝飲料，你是在找口感",
        description: "如果一杯沒有料就覺得空，那就先看珍珠、凍類、粉粿、布丁、芋圓這些配料明顯的品項。這些通常也是品牌最有記憶點的地方。",
        tags: ["珍珠", "凍類", "粉粿"],
        filter: (drink) => toppingKeywords(drink.name).length > 0,
        score: (drink) => {
            const toppings = toppingKeywords(drink.name).length;
            let score = toppings * 10;
            if (drink.category === "特色招牌類") score += 8;
            if (drink.category === "鮮奶茶類") score += 6;
            if (drink.price <= 80) score += 4;
            return score;
        }
    },
    light: {
        label: "輕負擔",
        hint: "從低熱量與無糖友善開始",
        headline: "想喝得輕，不代表只能喝得無聊",
        description: "低負擔路線適合從純茶與清爽果茶開始，再慢慢往有料或奶感延伸。先知道自己能接受多少甜與厚，才不會每次都點得太重。",
        tags: ["無糖友善", "純茶", "果茶"],
        filter: (drink) => drink.calories_nosugar <= 120,
        score: (drink) => {
            let score = 0;
            if (drink.calories_nosugar <= 40) score += 18;
            if (drink.category === "純茶類") score += 12;
            if (drink.category === "果汁茶類") score += 9;
            if (drink.price <= 65) score += 4;
            score += Math.max(0, 8 - drink.calories_nosugar / 25);
            return score;
        }
    },
    budget: {
        label: "50 元內",
        hint: "先用低門檻建立味覺地圖",
        headline: "先找到自己的安全牌，再往上加價升級",
        description: "如果你還在摸索，先從 50 元內喝出自己偏哪一路最有效。找到基準杯之後，再去挑高價特色款會更精準。",
        tags: ["先建立安全牌", "學生友善", "快速試錯"],
        filter: (drink) => drink.price <= 50,
        score: (drink) => {
            let score = 0;
            if (drink.price <= 40) score += 16;
            if (drink.price <= 50) score += 10;
            if (drink.category === "純茶類") score += 8;
            if (drink.category === "特色招牌類") score += 6;
            if (drink.calories_normal <= 360) score += 5;
            return score;
        }
    }
};

const CATEGORY_COPY = {
    "純茶類": {
        description: "建立茶感基準最快的一類，適合確認你偏好焙火、花香、熟成還是清爽。",
        bestFor: "適合剛開始想建立味覺的人"
    },
    "奶茶類": {
        description: "經典安全牌，茶與奶感比較直接，很多人的手搖記憶都從這裡開始。",
        bestFor: "適合要穩定滿足感的人"
    },
    "鮮奶茶類": {
        description: "奶香更乾淨，也更能喝出茶底與奶體之間的平衡。",
        bestFor: "適合怕奶精感、想喝得更滑順的人"
    },
    "奶蓋茶類": {
        description: "上層厚、下層清，喝的是層次感與鹹甜平衡，不只是熱量更高而已。",
        bestFor: "適合喜歡厚度與反差的人"
    },
    "果汁茶類": {
        description: "目前資料庫最大宗，代表市場對清爽、果香與季節感的長期需求。",
        bestFor: "適合怕膩、想先找容易喜歡的口味"
    },
    "特色招牌類": {
        description: "每家店最想被記住的代表作，也是理解品牌個性最有效的一區。",
        bestFor: "適合快速認識品牌定位"
    },
    "純植特調": {
        description: "植物奶與替代奶體是近年升級賽道，通常價格更高，也更強調差異化。",
        bestFor: "適合在找新口感與新趨勢的人"
    },
    "冰沙奶昔類": {
        description: "份量較少但個性鮮明，更接近甜點型飲料，而不是日常型手搖。",
        bestFor: "適合把手搖當甜點的人"
    }
};

const CATEGORY_ORDER = [
    "純茶類",
    "特色招牌類",
    "果汁茶類",
    "奶茶類",
    "鮮奶茶類",
    "奶蓋茶類",
    "純植特調",
    "冰沙奶昔類"
];

const PAGE_SIZE = 24;

document.addEventListener("DOMContentLoaded", async () => {
    const elements = {
        brandFilter: document.getElementById("brand-filter"),
        categoryFilter: document.getElementById("category-filter"),
        sortSelect: document.getElementById("sort-select"),
        searchBar: document.getElementById("search-bar"),
        resultsCount: document.getElementById("results-count"),
        resultsHelper: document.getElementById("results-helper"),
        drinksGrid: document.getElementById("drinks-grid"),
        finderInsights: document.getElementById("finder-insights"),
        activeTags: document.getElementById("active-tags"),
        clearFilters: document.getElementById("clear-filters"),
        loadMore: document.getElementById("load-more"),
        finderRouteButtons: document.getElementById("finder-route-buttons"),
        routeStory: document.getElementById("route-story"),
        categoryGrid: document.getElementById("category-grid"),
        nav: document.getElementById("site-nav"),
        statBrands: document.getElementById("stat-brands"),
        statDrinks: document.getElementById("stat-drinks"),
        statPrice: document.getElementById("stat-price"),
        statUpdated: document.getElementById("stat-updated"),
        heroSugarDrop: document.getElementById("hero-sugar-drop"),
        heroTopCategory: document.getElementById("hero-top-category"),
        heroTopCategoryCopy: document.getElementById("hero-top-category-copy"),
        heroZeroSugar: document.getElementById("hero-zero-sugar"),
        dataUpdated: document.getElementById("data-updated")
    };

    const state = {
        route: "all",
        search: "",
        brand: "ALL",
        category: "ALL",
        sort: "recommended",
        visible: PAGE_SIZE
    };

    let revealObserver;
    let drinkData = [];
    let categoryStats = [];
    let summary = null;

    initRevealObserver();
    observeReveals();
    bindNavScroll(elements.nav);

    try {
        const response = await fetch("../data/drink-database.json");
        if (!response.ok) {
            throw new Error("drink-database.json 讀取失敗");
        }

        const raw = await response.json();
        drinkData = flattenData(raw);
        summary = buildSummary(raw, drinkData);
        categoryStats = buildCategoryStats(drinkData);

        hydrateSummary(elements, summary);
        populateBrandFilter(elements.brandFilter, raw.brands.map((brand) => brand.name));
        populateCategoryFilter(elements.categoryFilter, categoryStats.map((item) => item.category));
        renderRouteButtons(elements.finderRouteButtons);
        renderRouteStory(elements.routeStory, drinkData, state.route);
        renderCategoryAtlas(elements.categoryGrid, categoryStats);
        observeReveals();
        wireEvents(elements, state, drinkData);
        renderAll(elements, state, drinkData);
    } catch (error) {
        console.error("Failed to initialize drink guide", error);
        elements.resultsCount.textContent = "載入失敗";
        elements.resultsHelper.textContent = "無法載入手搖資料，請確認你是透過 HTTP Server 開啟網站。";
        elements.drinksGrid.innerHTML = `
            <div class="empty-state">
                讀取資料時發生錯誤。請在專案根目錄執行 <code>python3 -m http.server 8000</code>，
                再開啟 <code>/website/index.html</code>。
            </div>
        `;
        elements.loadMore.hidden = true;
    }

    function wireEvents(dom, localState, items) {
        dom.searchBar.addEventListener("input", (event) => {
            localState.search = event.target.value.trim().toLowerCase();
            localState.visible = PAGE_SIZE;
            renderAll(dom, localState, items);
        });

        dom.brandFilter.addEventListener("change", (event) => {
            localState.brand = event.target.value;
            localState.visible = PAGE_SIZE;
            renderAll(dom, localState, items);
        });

        dom.categoryFilter.addEventListener("change", (event) => {
            localState.category = event.target.value;
            localState.visible = PAGE_SIZE;
            renderAll(dom, localState, items);
        });

        dom.sortSelect.addEventListener("change", (event) => {
            localState.sort = event.target.value;
            localState.visible = PAGE_SIZE;
            renderAll(dom, localState, items);
        });

        dom.clearFilters.addEventListener("click", () => {
            localState.route = "all";
            localState.search = "";
            localState.brand = "ALL";
            localState.category = "ALL";
            localState.sort = "recommended";
            localState.visible = PAGE_SIZE;

            dom.searchBar.value = "";
            dom.brandFilter.value = "ALL";
            dom.categoryFilter.value = "ALL";
            dom.sortSelect.value = "recommended";

            renderAll(dom, localState, items);
        });

        dom.loadMore.addEventListener("click", () => {
            localState.visible += PAGE_SIZE;
            renderResults(dom, getProcessedDrinks(items, localState), localState);
        });

        document.addEventListener("click", (event) => {
            const routeButton = event.target.closest("[data-route]");
            if (routeButton) {
                const route = routeButton.dataset.route;
                if (ROUTES[route]) {
                    localState.route = route;
                    localState.visible = PAGE_SIZE;
                    renderAll(dom, localState, items);

                    if (routeButton.dataset.jump === "finder") {
                        document.getElementById("finder").scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                }
            }

            const categoryButton = event.target.closest("[data-category-jump]");
            if (categoryButton) {
                const category = categoryButton.dataset.categoryJump;
                if (category) {
                    localState.category = category;
                    dom.categoryFilter.value = category;
                    localState.visible = PAGE_SIZE;
                    renderAll(dom, localState, items);
                    document.getElementById("finder").scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        });
    }

    function renderAll(dom, localState, items) {
        highlightActiveRoute(localState.route);
        renderRouteStory(dom.routeStory, items, localState.route);
        renderActiveTags(dom.activeTags, localState);
        const processed = getProcessedDrinks(items, localState);
        renderInsights(dom.finderInsights, processed);
        renderResults(dom, processed, localState);
    }

    function renderResults(dom, processed, localState) {
        const visibleItems = processed.slice(0, localState.visible);
        dom.resultsCount.textContent = `共 ${formatNumber(processed.length)} 杯`;
        dom.loadMore.hidden = processed.length <= localState.visible;

        if (processed.length === 0) {
            dom.resultsHelper.textContent = "目前沒有完全符合條件的結果，可以先清除路線或放寬品牌、類型條件。";
            dom.drinksGrid.innerHTML = `
                <div class="empty-state">
                    這組篩選沒有找到結果。試著先取消品牌限制，或切回「產業全景」看看整體有哪些路線。
                </div>
            `;
            return;
        }

        const uniqueBrands = new Set(processed.map((item) => item.brandName)).size;
        const avgPrice = average(processed.map((item) => item.price), 1);
        const avgNoSugar = average(processed.map((item) => item.calories_nosugar), 0);
        dom.resultsHelper.textContent = `${ROUTES[localState.route].label}目前涵蓋 ${formatNumber(uniqueBrands)} 個品牌，平均價位約 $${avgPrice}，無糖平均約 ${avgNoSugar} kcal。`;

        dom.drinksGrid.innerHTML = visibleItems.map((drink) => renderDrinkCard(drink, localState.route)).join("");
    }

    function renderInsights(container, processed) {
        if (processed.length === 0) {
            container.innerHTML = "";
            return;
        }

        const uniqueBrands = new Set(processed.map((item) => item.brandName)).size;
        const uniqueCategories = new Set(processed.map((item) => item.category)).size;
        const avgPrice = average(processed.map((item) => item.price), 1);
        const avgNormal = average(processed.map((item) => item.calories_normal), 0);
        const starter = processed[0];

        container.innerHTML = [
            {
                kicker: "篩到的市場面",
                value: `${formatNumber(uniqueBrands)} 個品牌`,
                copy: `這批結果橫跨 ${uniqueBrands} 個品牌、${uniqueCategories} 種類型，適合用來比較市場風格差異。`
            },
            {
                kicker: "目前平均體感",
                value: `$${avgPrice} / ${avgNormal} kcal`,
                copy: "這裡顯示的是目前篩選結果的平均價位與正常糖熱量，方便你抓整體厚重度。"
            },
            {
                kicker: "建議起手杯",
                value: starter.name,
                copy: `${starter.brandName} · ${starter.category} · $${starter.price}，如果你想先認識這條路線，可以從這杯開始。`
            }
        ].map((card) => `
            <article class="insight-card">
                <span class="insight-kicker">${card.kicker}</span>
                <strong>${card.value}</strong>
                <p>${card.copy}</p>
            </article>
        `).join("");
    }

    function renderDrinkCard(drink, routeId) {
        const tone = getTone(drink.calories_normal);
        const toppings = toppingKeywords(drink.name);
        const footerTags = [];

        if (toppings.length > 0) {
            footerTags.push(`咀嚼線索：${toppings.slice(0, 2).join("、")}`);
        } else if (drink.category === "純茶類") {
            footerTags.push("重點會落在茶底本身");
        } else {
            footerTags.push("適合感受品牌主軸");
        }

        if (drink.sugarDrop > 0) {
            footerTags.push(`改無糖少 ${drink.sugarDrop} kcal`);
        }

        return `
            <article class="drink-card">
                <div class="drink-card-top">
                    <span class="brand-badge">${drink.brandName}</span>
                    <span class="tone-badge ${tone.className}">${tone.label}</span>
                </div>

                <div class="drink-tags">
                    <span class="drink-tag">${drink.category}</span>
                    <span class="drink-tag">${drink.brandStyle}</span>
                </div>

                <h3>${drink.name}</h3>
                <p class="drink-subtitle">${drink.size}${routeSpecificLine(drink, routeId) ? ' · ' + routeSpecificLine(drink, routeId) : ''}</p>
                <p class="drink-note">${routeSpecificNote(drink, routeId)}</p>

                <div class="drink-metrics">
                    <div class="drink-metric">
                        <span>售價</span>
                        <strong>$${drink.price}</strong>
                    </div>
                    <div class="drink-metric">
                        <span>正常糖</span>
                        <strong>${drink.calories_normal} kcal</strong>
                    </div>
                    <div class="drink-metric">
                        <span>無糖</span>
                        <strong>${drink.calories_nosugar} kcal</strong>
                    </div>
                </div>

                <div class="card-footer">
                    <div class="card-footer-copy">
                        ${drink.calories_nosugar === 0
                            ? "這杯在無糖狀態幾乎就是你的基準杯，很適合拿來辨認茶底方向。"
                            : `這杯從正常糖改成無糖，平均可少 ${drink.sugarDrop} kcal，甜度調整對體感很有差。`}
                    </div>
                    <div class="card-footer-tags">
                        ${footerTags.map((tag) => `<span>${tag}</span>`).join("")}
                    </div>
                </div>
            </article>
        `;
    }

    function getProcessedDrinks(items, localState) {
        const routeConfig = ROUTES[localState.route];
        const filtered = items.filter((drink) => {
            const matchesRoute = routeConfig.filter(drink);
            const matchesBrand = localState.brand === "ALL" || drink.brandName === localState.brand;
            const matchesCategory = localState.category === "ALL" || drink.category === localState.category;
            const matchesSearch = !localState.search || drink.searchable.includes(localState.search);
            return matchesRoute && matchesBrand && matchesCategory && matchesSearch;
        });

        return filtered.sort((left, right) => sortDrinks(left, right, localState));
    }

    function sortDrinks(left, right, localState) {
        if (localState.sort === "price-asc") {
            return left.price - right.price || left.calories_nosugar - right.calories_nosugar;
        }

        if (localState.sort === "price-desc") {
            return right.price - left.price || right.calories_normal - left.calories_normal;
        }

        if (localState.sort === "nosugar-asc") {
            return left.calories_nosugar - right.calories_nosugar || left.price - right.price;
        }

        if (localState.sort === "normal-desc") {
            return right.calories_normal - left.calories_normal || right.price - left.price;
        }

        return ROUTES[localState.route].score(right) - ROUTES[localState.route].score(left) || left.price - right.price;
    }

    function renderActiveTags(container, localState) {
        const tags = [ROUTES[localState.route].label];
        if (localState.brand !== "ALL") tags.push(localState.brand);
        if (localState.category !== "ALL") tags.push(localState.category);
        if (localState.search) tags.push(`搜尋：${localState.search}`);
        container.innerHTML = tags.map((tag) => `<span>${tag}</span>`).join("");
    }

    function renderRouteStory(container, items, routeId) {
        const route = ROUTES[routeId];
        const count = items.filter((drink) => route.filter(drink)).length;
        container.innerHTML = `
            <div class="route-story-header">
                <span class="route-story-badge">${route.label}</span>
                <h3>${route.headline}</h3>
            </div>
            <p>${route.description} 目前資料內共有 ${formatNumber(count)} 杯符合這條路線。</p>
            <div class="route-story-tags">
                ${route.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
        `;
    }

    function renderRouteButtons(container) {
        container.innerHTML = Object.entries(ROUTES).map(([key, route]) => `
            <button class="route-button ${key === "all" ? "is-active" : ""}" data-route="${key}" type="button">
                <span class="route-button-title">${route.label}</span>
                <span class="route-button-hint">${route.hint}</span>
            </button>
        `).join("");
    }

    function highlightActiveRoute(routeId) {
        document.querySelectorAll("[data-route]").forEach((button) => {
            button.classList.toggle("is-active", button.dataset.route === routeId);
        });
    }

    function renderCategoryAtlas(container, stats) {
        container.innerHTML = stats.map((item) => {
            const copy = CATEGORY_COPY[item.category] || {
                description: "這一類反映的是特定飲用情境與口感需求。",
                bestFor: "適合拿來快速建立你的偏好"
            };

            return `
                <button class="atlas-card reveal" data-category-jump="${item.category}" type="button">
                    <div class="atlas-card-top">
                        <h3>${item.category}</h3>
                        <span class="atlas-count">${formatNumber(item.count)} 杯</span>
                    </div>
                    <p>${copy.description}</p>
                    <div class="atlas-metrics">
                        <div class="atlas-metric">
                            <span>平均售價</span>
                            <strong>$${item.avgPrice}</strong>
                        </div>
                        <div class="atlas-metric">
                            <span>正常糖</span>
                            <strong>${item.avgNormal} kcal</strong>
                        </div>
                        <div class="atlas-metric">
                            <span>無糖</span>
                            <strong>${item.avgNoSugar} kcal</strong>
                        </div>
                        <div class="atlas-metric">
                            <span>適合誰</span>
                            <strong>${copy.bestFor}</strong>
                        </div>
                    </div>
                </button>
            `;
        }).join("");
    }

    function populateBrandFilter(select, brands) {
        brands.sort((left, right) => left.localeCompare(right, "zh-Hant")).forEach((brand) => {
            const option = document.createElement("option");
            option.value = brand;
            option.textContent = brand;
            select.appendChild(option);
        });
    }

    function populateCategoryFilter(select, categories) {
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });
    }

    function hydrateSummary(dom, localSummary) {
        dom.statBrands.textContent = formatNumber(localSummary.totalBrands);
        dom.statDrinks.textContent = formatNumber(localSummary.totalItems);
        dom.statPrice.textContent = `$${localSummary.minPrice}–${localSummary.maxPrice}`;
        dom.statUpdated.textContent = localSummary.lastUpdated;
        dom.heroSugarDrop.textContent = `-${localSummary.avgSugarDrop} kcal`;
        dom.heroTopCategory.textContent = localSummary.topCategory.category;
        dom.heroTopCategoryCopy.textContent = `共 ${formatNumber(localSummary.topCategory.count)} 杯，約占整體 ${localSummary.topCategoryShare}%。`;
        dom.heroZeroSugar.textContent = formatNumber(localSummary.zeroSugarCount);
        dom.dataUpdated.textContent = localSummary.lastUpdated;
    }

    function flattenData(raw) {
        return raw.brands.flatMap((brand) =>
            brand.items.map((item) => ({
                ...item,
                brandName: brand.name,
                brandStyle: brand.style,
                sugarDrop: item.calories_normal - item.calories_nosugar,
                searchable: [
                    item.name,
                    item.category,
                    brand.name,
                    brand.style
                ].join(" ").toLowerCase()
            }))
        );
    }

    function buildSummary(raw, items) {
        const prices = items.map((item) => item.price);
        const normalCalories = items.map((item) => item.calories_normal);
        const noSugarCalories = items.map((item) => item.calories_nosugar);
        const topCategory = buildCategoryStats(items).sort((left, right) => right.count - left.count)[0];
        const cleanedUpdated = normalizeUpdatedAt(raw.last_updated);

        return {
            totalBrands: raw.brands.length,
            totalItems: items.length,
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
            minNoSugar: Math.min(...noSugarCalories),
            maxNormal: Math.max(...normalCalories),
            avgPrice: average(prices, 1),
            avgSugarDrop: average(items.map((item) => item.sugarDrop), 0),
            zeroSugarCount: items.filter((item) => item.calories_nosugar === 0).length,
            topCategory,
            topCategoryShare: ((topCategory.count / items.length) * 100).toFixed(1),
            lastUpdated: cleanedUpdated
        };
    }

    function buildCategoryStats(items) {
        const stats = CATEGORY_ORDER.map((category) => {
            const group = items.filter((item) => item.category === category);
            if (group.length === 0) return null;
            return {
                category,
                count: group.length,
                avgPrice: average(group.map((item) => item.price), 1),
                avgNormal: average(group.map((item) => item.calories_normal), 0),
                avgNoSugar: average(group.map((item) => item.calories_nosugar), 0)
            };
        }).filter(Boolean);

        const extras = [...new Set(items.map((item) => item.category))]
            .filter((category) => !CATEGORY_ORDER.includes(category))
            .map((category) => {
                const group = items.filter((item) => item.category === category);
                return {
                    category,
                    count: group.length,
                    avgPrice: average(group.map((item) => item.price), 1),
                    avgNormal: average(group.map((item) => item.calories_normal), 0),
                    avgNoSugar: average(group.map((item) => item.calories_nosugar), 0)
                };
            });

        return [...stats, ...extras];
    }

    function bindNavScroll(nav) {
        const onScroll = () => {
            nav.classList.toggle("is-scrolled", window.scrollY > 12);
        };

        onScroll();
        window.addEventListener("scroll", onScroll);
    }

    function initRevealObserver() {
        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: "0px 0px -60px 0px"
        });
    }

    function observeReveals() {
        document.querySelectorAll(".reveal").forEach((element) => {
            if (!element.dataset.revealBound) {
                element.dataset.revealBound = "true";
                revealObserver.observe(element);
            }
        });
    }
});

function formatNumber(value) {
    return new Intl.NumberFormat("zh-TW").format(value);
}

function average(values, precision) {
    if (!values.length) return 0;
    const raw = values.reduce((sum, value) => sum + value, 0) / values.length;
    return Number(raw.toFixed(precision));
}

function normalizeUpdatedAt(value) {
    const matched = String(value).match(/\d{4}-\d{2}-\d{2}/);
    return matched ? matched[0] : String(value);
}

function hasMilkKeyword(name) {
    return /奶|拿鐵|奶蓋|燕麥奶|豆漿/.test(name);
}

function toppingKeywords(name) {
    const keywords = [
        "珍珠",
        "波霸",
        "小珍珠",
        "椰果",
        "粉角",
        "粉粿",
        "布丁",
        "愛玉",
        "蘆薈",
        "仙草",
        "寒天",
        "白玉",
        "蒟蒻",
        "芋圓",
        "草仔粿",
        "茶凍",
        "奶蓋"
    ];

    return keywords.filter((keyword) => name.includes(keyword));
}

function getTone(calories) {
    if (calories <= 260) return { label: "清爽系", className: "tone-light" };
    if (calories <= 460) return { label: "均衡系", className: "tone-balanced" };
    if (calories <= 620) return { label: "厚感系", className: "tone-rich" };
    return { label: "甜點系", className: "tone-dessert" };
}

function routeSpecificLine(drink, routeId) {
    if (routeId === "tea") return `看茶底個性很有感的 ${drink.category}`;
    if (routeId === "milk") return `奶感與茶感交會的 ${drink.category}`;
    if (routeId === "fruit") return `果香先行的 ${drink.category}`;
    if (routeId === "chewy") return `咀嚼感存在感很高的 ${drink.category}`;
    if (routeId === "light") return `無糖也能成立的 ${drink.category}`;
    if (routeId === "budget") return `低門檻建立安全牌的 ${drink.category}`;
    return "";
}

function routeSpecificNote(drink, routeId) {
    const toppings = toppingKeywords(drink.name);

    if (routeId === "tea") {
        return `${drink.brandName} 的品牌風格是「${drink.brandStyle}」，這杯比較容易直接感受到茶底與香型。`;
    }

    if (routeId === "milk") {
        return `如果你要的是奶感包覆與穩定滿足，${drink.category} 會比純茶更容易快速喜歡。`;
    }

    if (routeId === "fruit") {
        return `果茶的重點不是只有水果名，而是酸甜與茶感有沒有平衡，這杯很適合拿來判斷你愛不愛這個牌子的果香路線。`;
    }

    if (routeId === "chewy") {
        return toppings.length > 0
            ? `這杯的咀嚼主角是 ${toppings.join("、")}，如果你喝手搖重視口感，它會比無料款更有記憶點。`
            : "這杯屬於口感相對乾淨的款式，適合拿來跟有料的飲品做對照。";
    }

    if (routeId === "light") {
        return `無糖熱量 ${drink.calories_nosugar} kcal，負擔相對友善，適合拿來建立自己的低負擔選杯範圍。`;
    }

    if (routeId === "budget") {
        return `價格落在 $${drink.price}，很適合當作你的第一批探索樣本，先找出自己偏哪種風格。`;
    }

    return "";
}
