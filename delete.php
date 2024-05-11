<?php
include "dbconn.php";
$id = $_GET["id"];
$sql = "DELETE FROM `products` WHERE id = $id";
$result = mysqli_query($conn, $sql);
if (!$result) {
    die("Query Failed" . mysqli_error($conn));
} else {
    header("Location: index.php?msg2");
}
