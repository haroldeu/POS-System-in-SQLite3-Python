function toggleUnderline(event) {
  const anchors = document.querySelectorAll(".item-wrapper nav ul li a");
  anchors.forEach((anchor) => {
    anchor.classList.remove("underline");
  });
  event.target.classList.add("underline");
}

document.querySelector(".hamburger").addEventListener("click", function () {
  var hamburgerIcon = document.querySelector(".hamburger-icon");
  var closeIcon = document.querySelector(".close-icon");
  var dropdwn = document.querySelector(".dropdown");

  // Check which icon is currently visible
  if (hamburgerIcon.style.display === "none") {
    // Show hamburger icon, hide close icon
    hamburgerIcon.style.display = "block";
    closeIcon.style.display = "none";
    dropdwn.style.display = "none";
  } else {
    // Show close icon, hide hamburger icon
    hamburgerIcon.style.display = "none";
    closeIcon.style.display = "block";
    dropdwn.style.display = "block";
  }
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
      success: function () {
        console.log("Product updated successsfully.");
        window.location.href = "/admin";
      },
      error: function (error) {
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
      alert(response.success);
      window.location.href = "/admin";
    });
  });
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
    window.location.reload();
    document.body.removeChild(link);
  });
