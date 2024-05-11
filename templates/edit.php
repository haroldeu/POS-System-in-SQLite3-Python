<?php
include 'dbconn.php';

if (isset($_POST['submit1'])) {
    // Get the values from the form
    $itemId = $_POST['editItemId'];
    $productName = $_POST['editItemName'];
    $productPrice = $_POST['editItemPrice'];
    $productType = $_POST['editType'];
    $productUnit = $_POST['editUnit'];


    // Check if an image is uploaded
    if ($_FILES['editItemImage']['size'] > 0) {
        $picture = $_FILES['editItemImage']['name'];
        $tmpname = $_FILES['editItemImage']['tmp_name'];
        $newfilename = uniqid() . "_" . $picture;

        // Move the uploaded image to the images folder
        move_uploaded_file($tmpname, "images/" . $newfilename);

        // Update the product information with the new image
        $query = "UPDATE `products` SET `product_image`='$newfilename',`product_name`='$productName', `product_price`='$productPrice', `product_type`='$productType', `product_unit`='$productUnit' WHERE id = $itemId";
    } else {
        // Update the product information without changing the image
        $query = "UPDATE `products` SET `product_name`='$productName', `product_price`='$productPrice', `product_type`='$productType', `product_unit`='$productUnit' WHERE id = $itemId";
    }

    // Execute the update query
    $result = mysqli_query($conn, $query);

    // Check if the query was successful
    if (!$result) {
        die("Query Failed" . mysqli_error($conn));
    } else {
        // Redirect to the homepage with a success message
        header("Location: index.php?msg=update_success");
    }
}
