import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import firebaseService from "~/services/firebase";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputFileUpload({ item, setItem }) {
  const [imagePreview, setImagePreview] = React.useState(null);

  const handleImageUpload = async (event) => {
    // Make the function async
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      // Make the callback function async
      // setImagePreview(reader.result);
      const imageUrl = await firebaseService.uploadImage(file); // Await the asynchronous operation
      setItem({
        ...item,
        imageUrl: imageUrl,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
        Upload image
        <VisuallyHiddenInput type="file" onChange={handleImageUpload} />
      </Button>
      {imagePreview && (
        <div>
          <img src={imagePreview} alt="Image preview" style={{ maxWidth: "100%", maxHeight: "450px" }} />
        </div>
      )}
    </div>
  );
}
