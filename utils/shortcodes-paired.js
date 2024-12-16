export default {
  gallery: function (content, name) {
    return `
      <div class="gallery gallery-${name}" id="gallery">
        ${content}
      </div>
    `.replace(/(\r\n|\n|\r)/gm, '');
  },
};
