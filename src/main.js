


document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.main-menu__icon');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const route = item.attributes.getNamedItem('data-route');
      if (route) {
        document.location = route.value;
      }
    });
  });
});