document.getElementsByClassName('preview')[0].addEventListener('click', previewClick);

function previewClick(e) {
    e.preventDefault();
}

var colorSortButton = document.createElement('button');
colorSortButton.innerHTML = "Order By Player Interaction";
colorSortButton.className = "sidebar-button";
colorSortButton.addEventListener('click', orderForceByColor);
document.getElementsByClassName('info')[0].appendChild(colorSortButton);

var sizeSortButton = document.createElement('button');
sizeSortButton.innerHTML = "Order By Player Population";
sizeSortButton.className = "sidebar-button";
sizeSortButton.addEventListener('click', orderForceBySize);
document.getElementsByClassName('info')[0].appendChild(sizeSortButton);
