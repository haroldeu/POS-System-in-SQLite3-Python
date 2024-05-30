function toggleUnderline(event) {
  const anchors = document.querySelectorAll(".item-wrapper nav ul li a");
  anchors.forEach((anchor) => {
    anchor.classList.remove("underline");
  });
  event.target.classList.add("underline");
}

// Wait until the HTML document is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get the elements from the DOM
  const adminToggle = document.getElementById("adminToggle");
  const container = document.querySelector(".container");
  const adminPage = document.querySelector(".admin-wrapper");
  const archivePage = document.querySelector(".archive-wrapper");
  const addBtn = document.querySelector(".add-btn");
  const archiveBtn = document.querySelector(".Archived");
  const toggleBtn = document.querySelector(".Toggle-wrapper");
  const closeBtn = document.getElementById("close-btn");
  const addContainer = document.getElementById("popupContainer");
  const closeArchive = document.getElementById("close-archive");
  const changePopup = document.querySelector(".cart-modal");
  const changeOpen = document.querySelector(".cart-open");
  const changeClose = document.querySelector(".cart-close");

  // Function to toggle display of elements
  const toggleDisplay = (element, displayStyle) => {
    element.style.display = displayStyle;
  };

  // Event listener for adminToggle change
  adminToggle.addEventListener("change", function () {
    if (adminToggle.checked) {
      toggleDisplay(container, "none");
      toggleDisplay(adminPage, "block");
    } else {
      toggleDisplay(container, "grid");
      toggleDisplay(adminPage, "none");
    }
  });

  // Event listener for addBtn click
  addBtn.addEventListener("click", function () {
    toggleDisplay(addContainer, "block");
  });

  // Event listener for closeBtn click
  closeBtn.addEventListener("click", function () {
    toggleDisplay(addContainer, "none");
  });

  archiveBtn.addEventListener("click", function () {
    toggleDisplay(archivePage, "block");
    toggleDisplay(adminPage, "none");
    toggleDisplay(toggleBtn, "none");
  });

  closeArchive.addEventListener("click", function () {
    toggleDisplay(archivePage, "none");
    toggleDisplay(adminPage, "block");
    toggleDisplay(toggleBtn, "flex");
  });

  changeOpen.addEventListener("click", function () {
    if (document.querySelector(".total-price").textContent == "₱0.00") {
      alert("Please select an item.");
      return;
    }

    toggleDisplay(changePopup, "block");
  });

  changeClose.addEventListener("click", function () {
    toggleDisplay(changePopup, "none");
  });
});

//Update price function
$(document).ready(function () {
  $(".update-btn").click(function () {
    var itemId = $(this).data("id");

    // Send AJAX request to get item details from Flask route
    $.post("/get_item_details", { itemId: itemId }, function (response) {
      var item = response;
      console.log(response);

      // Display item details in the HTML
      $("#editItemId").val(item.id);
      $(".product_name").text(item.product_name);
      $("#product_price").val(item.product_price);
      $("#newPrice").val(item.product_price);
      $("#popupContainer1").show();
    });
  });

  $("#close-btn1").click(function () {
    $("#popupContainer1").hide();
  });

  $(".editForm").submit(function (event) {
    event.preventDefault();

    var productId = $("#editItemId").val();
    var newPrice = $("#new_price").val();

    updateProductPrice(productId, newPrice);
  });

  function updateProductPrice(productId, newPrice) {
    $.ajax({
      url: "/edit",
      type: "POST",
      data: {
        id: productId,
        editItemPrice: newPrice,
      },
      success: function (response) {
        console.log("Product updated successsfully.");
        window.location.href = "/";
      },
      error: function (xhr, status, error) {
        console.error("Error updating product price: ", error);
      },
    });
  }
});

// Delete function
function deleteRecord(recordId) {
  if (confirm("Are you sure you want to delete this record?")) {
    // Send an AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/delete_record", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
      if (xhr.status === 200) {
        alert(xhr.responseText);
        // Optionally, update the UI or reload the page
        window.location.reload();
      } else {
        alert("Error: " + xhr.statusText);
      }
    };
    xhr.onerror = function () {
      alert("Network Error");
    };
    xhr.send("record_id=" + encodeURIComponent(recordId));
  }
}

// Filter function
function hideV_showF(type) {
  var cards = document.getElementsByClassName("cards");

  for (var i = 0; i < cards.length; i++) {
    var productType = cards[i].getAttribute("data-type");
    if (productType == type) {
      cards[i].style.display = "block";
    } else {
      cards[i].style.display = "none";
    }
  }
}

function hideF_showV(type) {
  var cards = document.getElementsByClassName("cards");

  for (var i = 0; i < cards.length; i++) {
    var productType = cards[i].getAttribute("data-type");
    if (productType == type) {
      cards[i].style.display = "block";
    } else {
      cards[i].style.display = "none";
    }
  }
}

function show_all() {
  var cards = document.getElementsByClassName("cards");
  for (var i = 0; i < cards.length; i++) cards[i].style.display = "block";
}

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

//Archive function
$(document).ready(function () {
  $(".archive-btn").click(function () {
    var productId = $(this).data("id");

    // Send a POST request to the Flask route
    $.post("/archive_product", { productId: productId }, function (response) {
      console.log(response.success);
      alert("Product has been archived");
      window.location.href = "/";
    });
  });
});

//Unarchive function
$(document).ready(function () {
  $(".unarchive-btn").click(function () {
    var productId = $(this).data("id");

    // Send a POST request to the Flask route
    $.post("/unarchive_product", { productId: productId }, function (response) {
      alert("Product has been unarchived");
      location.reload(); // Reload the page to reflect changes
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log("AJAX call failed: ", textStatus, errorThrown);
    });
  });
});

// Submit Add to Cart
document
  .getElementById("submit-add-to-cart")
  .addEventListener("click", function () {
    // Close the pop-up
    $(".modal").hide();

    // Fetch data from elements
    var productName = document.querySelector(".productName").textContent;
    var productPrice = document.querySelector(".productPrice").textContent;
    var productWeightGrams = document.getElementById("result").textContent;

    // Check if the product has been weighed (weight is not empty and greater than 0)
    if (!productWeightGrams || parseFloat(productWeightGrams) <= 0) {
      alert("Please weigh the product before adding to cart.");
      return; // Exit the function if no weight is provided
    }

    // Convert grams to kilograms and calculate total price
    var weightKg = parseFloat(productWeightGrams);
    var pricePerKg = parseFloat(productPrice.replace(/[^0-9.-]+/g, "")); // Extract numeric value from price string
    var totalPriceForProduct = (pricePerKg * weightKg).toFixed(2); // Calculate total price based on weight and price per kg

    // Format weight in kilograms to two decimal places for display
    var weightKgFormatted = `${weightKg.toFixed(2)}kg`;

    // Get the container where the receipts are being added
    var container = document.getElementById("receipts-container");
    var existingProduct = Array.from(container.children).find((child) => {
      const productNameElement = child.querySelector(".product-name");
      return productNameElement
        ? productNameElement.textContent === productName
        : false;
    });

    if (existingProduct) {
      // Update existing product
      var existingWeight = parseFloat(
        existingProduct
          .querySelector(".product-weight")
          .textContent.replace(/kg/, "")
      );
      var newWeight = existingWeight + weightKg;
      existingProduct.querySelector(
        ".product-weight"
      ).textContent = `${newWeight.toFixed(2)}kg`;
      var newTotalPrice = (pricePerKg * newWeight).toFixed(2);
      existingProduct.querySelector(
        ".total-product-price"
      ).textContent = `₱${newTotalPrice}`;
    } else {
      // Create a new div element for the receipt if product does not exist
      var newReceipt = document.createElement("div");
      newReceipt.className = "receipt";
      newReceipt.innerHTML = `
            <div class="item">
                <h2 class="product-name">${productName}</h2>
            </div>
            <div class="item-description">
                <span class="product-weight">${weightKgFormatted}</span>
                <span>@</span>
                <span class="product-price">₱${pricePerKg}/kg</span>
                <span class="total-product-price">₱${totalPriceForProduct}</span>
            </div>
        `;
      container.append(newReceipt);
    }

    // Update the total price
    var totalPriceSpans = document.querySelectorAll(".total-price");
    if (totalPriceSpans.length > 0) {
      // Parse the current total from the first total-price element
      currentTotal = parseFloat(
        totalPriceSpans[0].textContent.replace(/[^0-9.-]+/g, "")
      );
    }
    var newTotal = currentTotal + parseFloat(totalPriceForProduct);
    updateTotalPrices(newTotal);
  });

/////////////////////////////////////////////////////////////////

$(function () {
  // Cache selectors
  var addToCartBtn = $(".add-to-cart");
  var productName = $(".productName");
  var productPrice = $(".productPrice");
  var kiloModal = $("#KiloModal");
  var closeModalBtn = $(".close");

  // Combine event handlers
  addToCartBtn.on("click", function () {
    var itemId = $(this).attr("add-id");

    $.post({
      url: "/get_item_details",
      data: { itemId: itemId },
      dataType: "json", // Specify response type
    })
      .done(function (item) {
        productName.text(item.product_name);
        productPrice.text(`₱${item.product_price}/kilo`);

        // Show modal based on product type
        item.product_type = kiloModal.show();
      })
      .fail(function (xhr) {
        console.error(`Error fetching product details: ${xhr.statusText}`);
      });
  });

  // Close modal when close button is clicked
  closeModalBtn.on("click", function () {
    $(".modal").hide();
  });
});

// Add event listener to search input field
$(document).ready(function () {
  // Function to simulate typing into the search input
  function typeVirtualKeyboardKey() {
    $("#search").trigger("input"); // Trigger input event to filter cards
  }

  // Attach the function to all keys of the virtual keyboard
  $(".key").on("mousedown", function () {
    typeVirtualKeyboardKey($(this).text());
  });

  // Existing searc1h input function
  $("#search").on("input", function () {
    var searchQuery = $(this).val().toLowerCase(); // Get the search query and convert it to lowercase
    var cards = $(".card-wrapper .cards"); // Get all cards in the card-wrapper

    cards.each(function () {
      var productName = $(this).find("p").text().toLowerCase(); // Get the product name of the current card
      if (productName.startsWith(searchQuery)) {
        $(this).css("display", "block"); // If it does, display the card
      } else {
        $(this).css("display", "none"); // If it doesn't, hide the card
      }
    });
  });
});

// Search table function
$(document).ready(function () {
  // Function to simulate typing into the search input
  function typeVirtualKeyboardKey(inputSelector) {
    $(inputSelector).trigger("input");
  }

  // Attach the function to all keys of the virtual keyboard
  $(".key").on("mousedown", function () {
    typeVirtualKeyboardKey("#search-table1", $(this).text());
    typeVirtualKeyboardKey("#search-table2", $(this).text());
  });

  // Search input function for the first table rows
  $("#search-table1").on("input", function () {
    var searchQuery = $(this).val().toLowerCase();
    $("#admin .table tbody tr").each(function () {
      var itemName = $(this).find("td:nth-child(2)").text().toLowerCase();
      if (itemName.startsWith(searchQuery)) {
        $(this).css("display", "");
      } else {
        $(this).css("display", "none");
      }
    });
  });

  // Search input function for the second table rows
  $("#search-table2").on("input", function () {
    var searchQuery = $(this).val().toLowerCase();
    $("#archive .table tbody tr").each(function () {
      var itemName = $(this).find("td:nth-child(2)").text().toLowerCase();
      if (itemName.startsWith(searchQuery)) {
        $(this).css("display", "");
      } else {
        $(this).css("display", "none");
      }
    });
  });
});

// Virtual keyboard
$(document).ready(function () {
  // Show the virtual keyboard when any input field is focused
  $("input").on("focus", function () {
    if ($(this).attr("type") !== "submit") {
      $(".virtual-keyboard").show();
    }
  });

  // Hide the virtual keyboard when clicking outside
  $(document).on("click", function (event) {
    if (!$(event.target).closest(".virtual-keyboard, input").length) {
      $(".virtual-keyboard").hide();
    }
  });
});

// Function to update all total price displays
function updateTotalPrices(newTotal) {
  // Select all elements with the class 'total-price'
  var totalPriceSpans = document.querySelectorAll(".total-price");
  // Update the text content of each element
  totalPriceSpans.forEach((span) => {
    span.textContent = `₱${newTotal.toFixed(2)}`;
  });
}

// Creating a text file
document
  .getElementById("checkout-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    // Get the cash amount from the input
    let cashAmount = parseFloat(document.getElementById("moneyInput").value);
    if (isNaN(cashAmount)) {
      alert("Please enter a valid amount of money.");
      return;
    }

    let receipts = document.querySelectorAll(".receipt");
    let receiptText = "         Buctil Unisan, Quezon\n\n\n";

    receipts.forEach((receipt) => {
      let productName = receipt.querySelector(".product-name").textContent;
      let productWeight = receipt.querySelector(".product-weight").textContent;
      let productPrice = receipt.querySelector(".product-price").textContent;
      let totalPrice = receipt.querySelector(
        ".total-product-price"
      ).textContent;
      receiptText += `${productName}\n   ${productWeight}       ${productPrice}       ${totalPrice}\n\n`;
    });

    // Ensure grandTotal is parsed as a float
    let grandTotalText = document.querySelector(".total-price").textContent;
    let grandTotal = parseFloat(grandTotalText.replace(/[^0-9.-]+/g, "")); // Remove any non-numeric characters before parsing
    receiptText += `\nTOTAL:                        ${grandTotalText}\n\n`;

    // Calculate change
    let change = cashAmount - grandTotal;
    if (change < 0) {
      alert("Insufficient amount provided.");
      return;
    }

    let cash = `\nCASH:                         ₱${cashAmount.toFixed(2)}\n`;
    receiptText += cash;

    let changeCash = `\nCHANGE:                       ₱${change.toFixed(2)}`;
    receiptText += changeCash;

    // Create a Blob from the text
    let blob = new Blob([receiptText], { type: "text/plain;charset=utf-8" });

    // Create a link element, use it to download the blob
    let link = document.createElement("a");
    link.download = "Receipt.txt";
    link.href = window.URL.createObjectURL(blob);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

// // Printing the text file
// const { exec } = require("child_process");

/* function setPrinterPermissions(callback) {
  exec("sudo chmod 777 /dev/usb/lp0", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error setting permissions: ${error}`);
      return callback(error);
    }
    if (stderr) {
      console.error(`Permission stderr: ${stderr}`);
    }
    console.log("Permissions set to 777 successfully");
    callback(null);
  });
}

function printFile(filePath) {
  const printCommand = `cat ${filePath} > /dev/usb/lp0`;
  exec(printCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error printing file: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`Print stderr: ${stderr}`);
    }
    console.log(`File ${filePath} printed successfully`);
  });
} */

// Printing the text file

// function setPrinterPermissions(callback) {
//   exec("sudo chmod 777 /dev/usb/lp0", (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error setting permissions: ${error}`);
//       return callback(error);
//     }
//     if (stderr) {
//       console.error(`Permission stderr: ${stderr}`);
//     }
//     console.log("Permissions set to 777 successfully");
//     callback(null);
//   });
// }

// function printFile(filePath) {
//   const printCommand = `cat ${filePath} > /dev/usb/lp0`;
//   exec(printCommand, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error printing file: ${error}`);
//       return;
//     }
//     if (stderr) {
//       console.error(`Print stderr: ${stderr}`);
//     }
//     console.log(`File ${filePath} printed successfully`);
//   });
// }
