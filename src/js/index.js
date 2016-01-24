document.getElementsByClassName('preview')[0].addEventListener('click', previewClick);

function previewClick(e) {
    e.preventDefault();
}

// Helper function to remove an element from the DOM
// Element.prototype.remove = function() { this.parentElement.removeChild(this); }
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) this[i].parentElement.removeChild(this[i]);
    }
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

var restartButton = document.createElement('button');
restartButton.innerHTML = "Restart Visualization";
restartButton.className = "sidebar-button";
restartButton.addEventListener('click', restartEverything);
document.getElementsByClassName('info')[0].appendChild(restartButton);

datacraft();
