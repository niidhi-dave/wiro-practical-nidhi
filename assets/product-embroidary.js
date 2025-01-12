document.addEventListener("DOMContentLoaded", function () {
    // Select all sections with embroidery options (based on section ID)
    const sections = document.querySelectorAll('[data-section-embroidary-id]');
  
    sections.forEach((section) => {
        const sectionId = section.getAttribute('data-section-embroidary-id');
        const embroideryCheckbox = section.querySelector(`#${sectionId}`);
        const toggleDiv = section.querySelector(".show-embroidary-options");
        const embroidaryNameInput = section.querySelector(".embroidary-name-choice");
        const colorRadios = section.querySelectorAll(".color-radio");
        const fontRadios = section.querySelectorAll(".font-radio");
        const embroideryPriceElement = section.querySelector(".embroidary-options-price");
        const selectedColor = document.getElementById("selected-color");
        const selectedColorPrice = document.getElementById("selected-color-price");
        const selectedFont = document.getElementById("selected-font");
        const selectedFontPrice = document.getElementById("selected-font-price");
        const embroidaryOptionCheckbox = section.querySelector(".toggle-options-block");

        let selectedColorValue = '';
        let selectedFontValue = '';
        let colorPrice = 0;
        let fontPrice = 0;

        // Toggle Embroidery options
        embroidaryOptionCheckbox.addEventListener("change", function (e) {
            if (toggleDiv) {
                if (embroidaryOptionCheckbox.checked) {
                    embroidaryOptionCheckbox.checked = true;
                    toggleDiv.classList.add("!twcss-block");
                } else {
                    embroidaryOptionCheckbox.checked = false;
                    toggleDiv.classList.remove("!twcss-block");
                }
            }
        });

        // Update price display
        function updatePrices(color = "", colorPriceUpdated = 0, font = "", fontPriceUpdated = 0) {
            const additionalColorPrice = colorPriceUpdated !== 0 ? colorPriceUpdated : colorPrice;
            const additionalFontPrice = fontPriceUpdated !== 0 ? fontPriceUpdated : fontPrice;
            const additionalPrice = additionalColorPrice + additionalFontPrice;
            embroideryPriceElement.textContent = additionalPrice > 0 ? `+£${additionalPrice.toFixed(2)}` : "+£0";

            // Update hidden input values
            selectedColor.value = color !== "" ? color : selectedColorValue;
            selectedColorPrice.value = additionalColorPrice;
            selectedFont.value = font !== "" ? font : selectedFontValue;
            selectedFontPrice.value = additionalFontPrice;
        }

        // Handle embroidery checkbox toggle
        embroideryCheckbox.addEventListener("change", () => {
            updatePrices();
        });

        // Handle color selection
        colorRadios.forEach((radio) => {
            radio.addEventListener("change", (e) => {
                if (e.target.checked) {
                    selectedColorValue = e.target.value;
                    colorPrice = parseFloat(e.target.getAttribute("data-color-price")) || 0;
                    e.target.nextElementSibling.style.borderColor = "#3b82f6";
                    updatePrices();
                }
            });
        });

        // Handle font selection
        fontRadios.forEach((radio) => {
            radio.addEventListener("change", (e) => {
                if (e.target.checked) {
                    selectedFontValue = e.target.value;
                    fontPrice = parseFloat(e.target.getAttribute("data-font-price")) || 0;
                    e.target.nextElementSibling.style.backgroundColor = "#666666";
                    e.target.nextElementSibling.style.color = "#ffffff";
                    updatePrices();
                }
            });
        });

        // Initial calculation for the section
        updatePrices();

        fetch('/cart.js').then(response => response.json()).then(cart => {
            for (cartItem of cart.items) {
                const properties = cartItem.properties;

                if (properties) {
                    if (properties.embroidary_name && embroidaryNameInput) {
                        embroidaryNameInput.value = properties.embroidary_name;
                    }
                    if (properties.color_style) {
                        const selectedColor = document.querySelector(`input[name="color-choice"][value="${properties.color_style}"]`);
                        if (selectedColor) {
                            selectedColor.checked = true;
                            selectedColor.nextElementSibling.style.borderColor = "#3b82f6";
                        }
                    }
                    if (properties.font_style) {
                        const selectedFont = document.querySelector(`input[name="font-choice"][value="${properties.font_style}"]`);
                        if (selectedFont) {
                            selectedFont.checked = true;
                            selectedFont.nextElementSibling.style.backgroundColor = "#666666";
                            selectedFont.nextElementSibling.style.color = "#ffffff";
                        }
                    }

                    if (embroideryCheckbox) {
                        embroideryCheckbox.checked = true;
                        if (toggleDiv) {
                            toggleDiv.classList.add("!twcss-block");
                        }
                    }

                    updatePrices(properties.color_choice, +properties.color_price, properties.font_choice, +properties.font_price);
                }
            }
        });
    });
});
