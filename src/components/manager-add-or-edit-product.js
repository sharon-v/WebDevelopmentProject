/* code for hashtags in add/edit new product page- */
const hashtagArray = [];
let t;

const input = document.querySelector('#hashtags');
const container = document.querySelector('.tag-container');

input.addEventListener('keyup', () => {
  if (event.which == 13 && input.value.length > 0) {
    const text = document.createTextNode(input.value);
    const p = document.createElement('p');
    container.appendChild(p);
    p.appendChild(text);
    p.classList.add('tag');
    input.value = '';

    const deleteTags = document.querySelectorAll('.tag');

    for (let i = 0; i < deleteTags.length; i++) {
      deleteTags[i].addEventListener('click', () => {
        container.removeChild(deleteTags[i]);
      });
    }
  }
});

/* code fo displaying picture in add/edit new product page */
const imageInput = document.querySelector('#imageInput');

imageInput.addEventListener('change', function () {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const uploadedImage = reader.result;
    document.querySelector(
      '#displayImage'
    ).style.backgroundImage = `url(${uploadedImage})`;
  });
  reader.readAsDataURL(files[0]);
});
