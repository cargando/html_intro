class Claim {
    constructor(name, client, date) {
        this.name = name;
        this.client = client;
        this.date = date;
    }
}

const claims = [];

const makeUL = (array) => {
    const list = document.createElement('ul');

    list.id = 'claimList';
    list.classList.add('list-group');

    for (let i = 0; i < array.length; i++) {
        const item = document.createElement('li');

        item.classList.add('list-group-item');
        item.appendChild(document.createTextNode(array[i].name + ' ' + array[i].client + ' ' + array[i].date));
        list.appendChild(item);
    }

    return list;
};

const saveData = () => {
    const name = document.querySelector("#claimData").value;
    const client = document.querySelector("#claimClient").value;
    const date = document.querySelector("#claimDate").value;

    const claim = new Claim(name, client, date);
    claims.push(claim);

    alert(claim.name);
    alert(claim.client);
    alert(claim.date);

    const element = document.querySelector('#claimList');
    const parent = element.parentNode;
    const newElement = makeUL(claims);

    parent.insertBefore(newElement, element);
    parent.removeChild(element);
};