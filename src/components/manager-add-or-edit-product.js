/*code for hashtags in add/edit new product page-*/
let input, hashtagArray, container, t;

input = document.querySelector("#hashtags");
container = document.querySelector(".tag-container");
hashtagArray = [];

input.addEventListener("keyup", () => {
  if (event.which == 13 && input.value.length > 0) {
    var text = document.createTextNode(input.value);
    var p = document.createElement("p");
    container.appendChild(p);
    p.appendChild(text);
    p.classList.add("tag");
    input.value = "";

    let deleteTags = document.querySelectorAll(".tag");

    for (let i = 0; i < deleteTags.length; i++) {
      deleteTags[i].addEventListener("click", () => {
        container.removeChild(deleteTags[i]);
      });
    }
  }
});

/*code fo displaying picture in add/edit new product page*/
const image_input = document.querySelector("#image-input");

image_input.addEventListener("change", function () {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector(
      "#display-image"
    ).style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
});
