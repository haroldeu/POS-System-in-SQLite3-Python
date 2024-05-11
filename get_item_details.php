<?php
// Include database connection
include 'dbconn.php';

// Check if itemId is set and not empty
if (isset($_POST['itemId']) && !empty($_POST['itemId'])) {
    // Sanitize input to prevent SQL injection
    $itemId = mysqli_real_escape_string($conn, $_POST['itemId']);

    // Prepare SQL query to fetch item details
    $sql = "SELECT * FROM products WHERE id = '$itemId'";
    $result = mysqli_query($conn, $sql);

    if ($result) {
        // Check if item exists
        if (mysqli_num_rows($result) > 0) {
            // Fetch item details as an associative array
            $item = mysqli_fetch_assoc($result);

            // Encode item details as JSON and send it back
            echo json_encode($item);
        } else {
            // Item not found
            echo json_encode(array('error' => 'Item not found'));
        }
    } else {
        // SQL query execution error
        echo json_encode(array('error' => 'Failed to fetch item details'));
    }
} else {
    // Invalid request
    echo json_encode(array('error' => 'Invalid request'));
}
