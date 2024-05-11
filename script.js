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
    $.post("get_item_details.php", { itemId: itemId }, function (response) {
      var item = JSON.parse(response);
      $("#editItemId").val(item.id);
      $("#editItemName").val(item.product_name);
      $("#editItemPrice").val(item.product_price);
      $("#editKilo").prop("checked", item.product_type === "kilo");
      $("#editPcs").prop("checked", item.product_type === "pcs");
      $("#editVegs").prop("checked", item.product_unit === "vegetable");
      $("#editFruit").prop("checked", item.product_unit === "fruit");
      $("#popupContainer1").show();
    });
  });

  $("#close-btn1").click(function () {
    $("#popupContainer1").hide();

    $("#editForm").submit(function (e) {
      e.preventDefault();
      $.post({
        url: "edit.php",
        data: new FormData(this),
        processData: false,
        contentType: false,
        success: function (response) {
          console.log(response);
          $("#popupContainer1").hide();
        },
        error: function (xhr, status, error) {
          console.error(xhr.responseText);
        },
      });
    });
  });
});

$(function () {
  // Cache selectors
  var addToCartBtn = $(".add-to-cart");
  var productName = $(".productName");
  var productPrice = $(".productPrice");
  var kiloModal = $("#KiloModal");
  var pcsModal = $("#PcsModal");
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
      var productName = $(this).find("h2").text().toLowerCase();

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
