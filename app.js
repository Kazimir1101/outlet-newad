$(document).ready(function(){
    // =========================
    // VARIABLES
    // =========================
    let selectedFiles = [];

    // =========================
    // IMAGE SELECT
    // =========================
    $("#productImages").on("change", function () {
        selectedFiles = Array.from(this.files);

        // Maksimum 5 şəkil
        if (selectedFiles.length > 5) {
            selectedFiles = selectedFiles.slice(0, 5);
            updateFileInput();
        }

        renderImagePreview();
        clearImageError();
    });

    // =========================
    // IMAGE PREVIEW
    // =========================
    function renderImagePreview() {
        const preview = $(".image-preview");
        preview.empty();

        if (selectedFiles.length === 0) {
            preview.removeClass("active");
            return;
        }

        preview.addClass("active");

        selectedFiles.forEach(function (file, index) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const item = $(`
                    <div class="preview-item">
                        <img src="${e.target.result}" alt="Məhsul şəkli">
                        <button type="button" class="preview-remove" data-index="${index}">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                `);
                preview.append(item);
            };

            reader.readAsDataURL(file);
        });
    }

    // =========================
    // REMOVE IMAGE
    // =========================
    $(document).on("click", ".preview-remove", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const index = Number($(this).attr("data-index"));
        selectedFiles.splice(index, 1);

        updateFileInput();
        renderImagePreview();
        clearImageError();
    });

    // =========================
    // UPDATE FILE INPUT
    // =========================
    function updateFileInput() {
        const dataTransfer = new DataTransfer();

        selectedFiles.forEach(function (file) {
            dataTransfer.items.add(file);
        });

        $("#productImages")[0].files = dataTransfer.files;
    }

    // =========================
    // CLEAR IMAGE ERROR
    // =========================
    function clearImageError() {
        if (selectedFiles.length > 0) {
            const group = $("#productImages").closest(".form-group");
            group.removeClass("has-error");
            group.find(".form-error").text("");
        }
    }

    // =========================
    // PHONE FORMAT — 050 123 45 67
    // =========================
    $("#phone").on("input", function () {
        let value = $(this).val().replace(/\D/g, "").substring(0, 10);
        let formatted = "";

        if (value.length > 0) formatted += value.substring(0, 3);
        if (value.length > 3) formatted += " " + value.substring(3, 6);
        if (value.length > 6) formatted += " " + value.substring(6, 8);
        if (value.length > 8) formatted += " " + value.substring(8, 10);

        $(this).val(formatted);
    });

    // =========================
    // QUANTITY — MAX 3 RƏQƏM
    // =========================
    $("#quantity").on("input", function () {
        let value = $(this).val().replace(/\D/g, "").substring(0, 3);

        // 0 ilə başlayırsa təmizləyirik
        if (value.length > 0 && value.charAt(0) === "0") {
            value = value.replace(/^0+/, "");
        }

        $(this).val(value);
    });

    $("#quantity").on("keydown", function (e) {
        const forbidden = ["e", "E", "+", "-", ".", ","];
        if (forbidden.indexOf(e.key) !== -1) e.preventDefault();
    });

    $("#quantity").on("paste", function (e) {
        e.preventDefault();
        const pasted = (e.originalEvent || e).clipboardData.getData("text");
        let value = pasted.replace(/\D/g, "").substring(0, 3);

        if (value.length > 0 && value.charAt(0) === "0") {
            value = value.replace(/^0+/, "");
        }

        $(this).val(value);
    });

    // =========================
    // PRICE FORMAT — yalnız rəqəm + nöqtə
    // =========================
    function formatPriceInput($input) {
        let value = $input.val();
        value = value.replace(/,/g, ".").replace(/[^0-9.]/g, "");

        // Yalnız bir nöqtə
        const firstDot = value.indexOf(".");
        if (firstDot !== -1) {
            value = value.substring(0, firstDot + 1) +
                    value.substring(firstDot + 1).replace(/\./g, "");
        }

        let parts = value.split(".");
        parts[0] = parts[0].replace(/^0+(?=\d)/, "").substring(0, 5);

        if (parts.length > 1) {
            parts[1] = parts[1].substring(0, 2);
        }

        value = parts.join(".");
        $input.val(value);
    }

    $("#oldPrice, #newPrice").on("input", function () {
        formatPriceInput($(this));
    });

    $("#oldPrice, #newPrice").on("keydown", function (e) {
        const forbidden = ["e", "E", "+", "-", " "];
        if (forbidden.indexOf(e.key) !== -1) e.preventDefault();
    });

    $("#oldPrice, #newPrice").on("paste", function (e) {
        e.preventDefault();
        const pasted = (e.originalEvent || e).clipboardData.getData("text");
        $(this).val(pasted);
        formatPriceInput($(this));
    });

    // =========================
    // PRODUCT DESCRIPTION
    // =========================
    $("#productFullInfo").on("keydown", function (e) {
        if (e.key === "Enter") e.preventDefault();
    });

    $("#productFullInfo").on("input", function () {
        const maxLength = 150;
        let value = $(this).val();

        // Yeni sətirləri boşluqla əvəz edirik
        value = value.replace(/[\r\n]+/g, " ");

        if (value.length > maxLength) {
            value = value.substring(0, maxLength);
        }

        $(this).val(value);
    });

    // =========================
    // CATEGORY SELECT
    // =========================
    $(document).on("click", ".category-select-button", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const select = $(this).closest(".custom-category-select");

        // Digər dropdown-ları bağlayırıq
        $(".custom-city-select, .custom-duration-select").removeClass("active");
        $(".custom-category-select").not(select).removeClass("active");

        select.toggleClass("active");
    });

    $(document).on("click", ".category-option", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const option = $(this);
        const value = option.attr("data-value");
        const text = option.text().trim();
        const select = option.closest(".custom-category-select");

        select.find(".category-selected-text").text(text).removeClass("placeholder");
        select.find(".category-option").removeClass("selected");
        option.addClass("selected");

        $("#category").val(value);
        select.removeClass("active");

        clearFieldError("#category");
    });

    // =========================
    // CITY SELECT
    // =========================
    $(document).on("click", ".city-select-button", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const select = $(this).closest(".custom-city-select");

        $(".custom-category-select, .custom-duration-select").removeClass("active");
        $(".custom-city-select").not(select).removeClass("active");

        select.toggleClass("active");
    });

    $(document).on("click", ".city-option", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const option = $(this);
        const value = option.attr("data-value");
        const text = option.text().trim();
        const select = option.closest(".custom-city-select");

        select.find(".city-selected-text").text(text).removeClass("placeholder");
        select.find(".city-option").removeClass("selected");
        option.addClass("selected");

        $("#city").val(value);
        select.removeClass("active");

        clearFieldError("#city");
    });

    // =========================
    // DURATION SELECT
    // =========================
    $(document).on("click", ".duration-select-button", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const select = $(this).closest(".custom-duration-select");
        if (!select.length) return;

        $(".custom-category-select, .custom-city-select").removeClass("active");
        $(".custom-duration-select").not(select).removeClass("active");

        select.toggleClass("active");
    });

    $(document).on("click", ".duration-option", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const option = $(this);
        const value = option.attr("data-value");
        const text = option.text().trim();
        const select = option.closest(".custom-duration-select");

        if (!select.length) return;

        select.find(".duration-selected-text").text(text).removeClass("placeholder");
        select.find(".duration-option").removeClass("selected");
        option.addClass("selected");

        $("#deleteAfter").val(value);
        select.removeClass("active");

        clearFieldError("#deleteAfter");
    });

    // =========================
    // CLICK OUTSIDE
    // =========================
    $(document).on("click", function (e) {
        if ($(e.target).closest(
            ".custom-category-select, .custom-city-select, .custom-duration-select"
        ).length) {
            return;
        }

        $(".custom-category-select, .custom-city-select, .custom-duration-select")
            .removeClass("active");
    });

    // =========================
    // ESC
    // =========================
    $(document).on("keydown", function (e) {
        if (e.key === "Escape") {
            $(".custom-category-select, .custom-city-select, .custom-duration-select")
                .removeClass("active");
        }
    });

    // =========================
    // FORM SUBMIT
    // =========================
    $("#createAdForm").on("submit", function (e) {
        e.preventDefault();

        let isValid = true;

        // Əvvəlki xətaları təmizləyirik
        $(".form-group, .price-duration-group").removeClass("has-error");
        $(".form-error").text("");

        // KATEQORİYA
        const category = $("#category").val().trim();
        if (category === "") {
            showError("#category", "Kateqoriya seçin");
            isValid = false;
        }

        // DÜKANIN ADI
        const shopName = $("#shopName").val().trim();
        if (shopName === "") {
            showError("#shopName", "Dükanın adını daxil edin");
            isValid = false;
        }

        // MƏHSULUN ADI
        const productName = $("#productName").val().trim();
        if (productName === "") {
            showError("#productName", "Məhsulun adını daxil edin");
            isValid = false;
        }

        // ƏTRAFLI MƏLUMAT
        const productFullInfo = $("#productFullInfo").val().trim();
        if (productFullInfo === "") {
            showError("#productFullInfo", "Məhsul haqqında məlumat daxil edin");
            isValid = false;
        }

        // MİQDAR
        const quantity = $("#quantity").val().trim();
        if (
            quantity === "" ||
            Number(quantity) <= 0 ||
            Number(quantity) > 999 ||
            !/^\d{1,3}$/.test(quantity)
        ) {
            showError("#quantity", "Miqdarı düzgün daxil edin");
            isValid = false;
        }

        // QİYMƏTLƏR
        const oldPrice = $("#oldPrice").val().trim();
        const newPrice = $("#newPrice").val().trim();

        if (oldPrice === "" || Number(oldPrice) <= 0) {
            showError("#oldPrice", "Köhnə qiyməti daxil edin");
            isValid = false;
        }

        if (newPrice === "" || Number(newPrice) <= 0) {
            showError("#newPrice", "Yeni qiyməti daxil edin");
            isValid = false;
        }

        if (
            oldPrice !== "" && newPrice !== "" &&
            Number(oldPrice) > 0 && Number(newPrice) > 0 &&
            Number(newPrice) >= Number(oldPrice)
        ) {
            showError("#newPrice", "Yeni qiymət köhnə qiymətdən aşağı olmalıdır");
            isValid = false;
        }

        // ELAN MÜDDƏTİ
        const deleteAfter = $("#deleteAfter").val().trim();
        if (deleteAfter === "") {
            showError("#deleteAfter", "Elan müddətini seçin");
            isValid = false;
        }

        // ƏLAQƏ NÖMRƏSİ
        const phone = $("#phone").val().trim();
        const phoneDigits = phone.replace(/\D/g, "");

        if (phone === "") {
            showError("#phone", "Əlaqə nömrəsini daxil edin");
            isValid = false;
        } else if (phoneDigits.length !== 10) {
            showError("#phone", "Əlaqə nömrəsini düzgün daxil edin");
            isValid = false;
        }

        // ŞƏHƏR
        const city = $("#city").val().trim();
        if (city === "") {
            showError("#city", "Şəhər seçin");
            isValid = false;
        }

        // ÜNVAN
        const address = $("#address").val().trim();
        if (address === "") {
            showError("#address", "Ünvanı daxil edin");
            isValid = false;
        }

        // ŞƏKİL
        if (selectedFiles.length === 0) {
            const imageGroup = $("#productImages").closest(".form-group");
            imageGroup.addClass("has-error");
            imageGroup.find(".form-error").text("Ən azı bir şəkil seçin");
            isValid = false;
        }

        // FORM KEÇƏRSİZDİRSƏ
        if (!isValid) {
            const firstError = $(".form-group.has-error, .price-duration-group.has-error").first();
            if (firstError.length) {
                $("html, body").animate(
                    { scrollTop: firstError.offset().top - 25 },
                    350
                );
            }
            return;
        }

        // FORM DATA
        const formData = new FormData(this);
        formData.delete("productImages");

        selectedFiles.forEach(function (file) {
            formData.append("productImages", file);
        });

        // DEBUG
        console.log("Kateqoriya:", category);
        console.log("Dükan:", shopName);
        console.log("Məhsul:", productName);
        console.log("Ətraflı:", productFullInfo);
        console.log("Miqdar:", quantity);
        console.log("Əvvəlki qiymət:", oldPrice);
        console.log("Endirimli qiymət:", newPrice);
        console.log("Elan müddəti:", deleteAfter);
        console.log("Telefon:", phone);
        console.log("Şəhər:", city);
        console.log("Ünvan:", address);
        console.log("Şəkillər:", selectedFiles);

        // BACKEND
        /*
        $.ajax({
            url: "/api/ads",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log("Elan uğurla əlavə edildi");
            },
            error: function (xhr) {
                console.log("Xəta baş verdi");
            }
        });
        */

        console.log("Form backend-ə göndərilməyə hazırdır.");
    });

    // =========================
    // SHOW ERROR
    // =========================
    function showError(selector, message) {
        const input = $(selector);
        if (!input.length) return;

        let group = input.closest(".form-group");

        if (!group.length && (selector === "#deleteAfter" || selector === "#oldPrice" || selector === "#newPrice")) {
            group = input.closest(".price-duration-group");
        }

        if (!group.length) {
            group = input.parent();
        }

        group.addClass("has-error");
        group.find(".form-error").first().text(message);
    }

    // =========================
    // CLEAR FIELD ERROR
    // =========================
    function clearFieldError(selector) {
        const input = $(selector);
        if (!input.length) return;

        let group = input.closest(".form-group");

        if (!group.length && (selector === "#deleteAfter" || selector === "#oldPrice" || selector === "#newPrice")) {
            group = input.closest(".price-duration-group");
        }

        if (!group.length) {
            group = input.parent();
        }

        group.removeClass("has-error");
        group.find(".form-error").first().text("");
    }

    // =========================
    // REMOVE ERROR WHILE TYPING
    // =========================
    $("#createAdForm").on("input change", "input, textarea", function () {
        const element = $(this);
        let group = element.closest(".form-group");

        if (!group.length && (
            element.is("#deleteAfter") ||
            element.is("#oldPrice") ||
            element.is("#newPrice")
        )) {
            group = element.closest(".price-duration-group");
        }

        if (!group.length) return;

        group.removeClass("has-error");
        group.find(".form-error").first().text("");
    });

    // =========================
    // BACK TO MAIN
    // =========================
    $(".back-to-main-button").on("click", function (e) {
        e.preventDefault();
        window.location.href = "/home/index.html";
    });

});
