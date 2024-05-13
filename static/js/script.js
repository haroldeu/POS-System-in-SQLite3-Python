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
  const addBtn = document.querySelector(".add-btn");
  const closeBtn = document.getElementById("close-btn");
  const addContainer = document.getElementById("popupContainer");

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
});

$(document).ready(function () {
  $(".update-btn").click(function () {
    var itemId = $(this).data("id");

    // Send AJAX request to get item details from Flask route
    $.post("/get_item_details", { itemId: itemId }, function (response) {
      var item = response;
      console.log(response);

      // Display item details in the HTML
      $("#editItemId").val(item.id);
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

// Delete Function
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

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

$(function () {
  // Cache selectors
  var addToCartBtn = $(".add-to-cart");
  var productName = $(".productName");
  var productPrice = $(".productPrice");
  var kiloModal = $("#KiloModal");
  var closeModalBtn = $(".close");
  var searchInput = $("#search");

  // Combine event handlers
  addToCartBtn.on("click", function () {
    var itemId = $(this).attr("add-id");

    $.post({
      url: "get_item_details.php",
      data: { itemId: itemId },
      dataType: "json", // Specify response type
    })
      .done(function (item) {
        productName.text(item.product_name);
        productPrice.text(`₱${item.product_price}/${item.product_type}`);

        // Show modal based on product type
        item.product_type === "kilo" ? kiloModal.show() : pcsModal.show();
      })
      .fail(function (xhr) {
        console.error(`Error fetching product details: ${xhr.statusText}`);
      });
  });

  // Close modal when close button is clicked
  closeModalBtn.on("click", function () {
    $(".modal").hide();
  });

  // Add event listener to search input field
  searchInput.on("input", function () {
    var searchQuery = $(this).val().toLowerCase(); // Get the search query and convert it to lowercase

    // Get all cards in the card-wrapper
    var cards = $(".card-wrapper .cards");

    // Iterate through each card
    cards.each(function () {
      // Get the product name of the current card
      var productName = $(this).find("p").text().toLowerCase();

      // Check if the product name starts with the search query
      if (productName.startsWith(searchQuery)) {
        // If it does, display the card
        $(this).css("display", "block");
      } else {
        // If it doesn't, hide the card
        $(this).css("display", "none");
      }
    });
  });
});
