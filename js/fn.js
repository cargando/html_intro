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


//////////// ----------- ////////////
//////////// ----------- ////////////
//////////// ----------- ////////////
//////////// ----------- ////////////
//////////// ----------- ////////////
//////////// ----------- ////////////
//////////// ----------- ////////////
//////////// ----------- ////////////
//////////// ----------- ////////////
//////////// ----------- ////////////



setTimeout(getterInfo, 100);

function getterInfo(){
  $.get( 'https://kb.epam.com/rest/jiraanywhere/1.0/servers')
    .done(function(data) {
      console.log(">>>>>>>> DATA: ", data)
      let index = null;

      data.forEach((localItem, localIndex) => {
        if (localItem.name === "EPAM-JIRA-EU") {
          index = localIndex;
        }
      });

      if (index === null) {
        alert("Can't find JIRA ID from response, see additional data in console");
        console.log(">>>>>>>> Can't find JIRA ID from response");
        console.log(">>>>>>>> Failed to find 'EPAM-JIRA-EU' in DATA array (look upper)");

      }
      window['__MPA_STATE__'] = {
        primaryJiraId: data[index] ? data[index].id : null,
        primaryJiraAddress: data[index] ? data[index].url : null,
      }

      addHandlerToDeployLinks();
    })
    .fail(function(err) {
      alert( ">>> Shit on me while trying to get JIRA UID: " + err);
    })
}


function glueLables(ms, prefix) {

  return ms.map((val) => ("&labels=" + (prefix || "") + val)).join("");
}

function runPromisses(clickedItem) {

  const UID = window['__MPA_STATE__'].primaryJiraId
  const address = window['__MPA_STATE__'].primaryJiraAddress
  const jiraURLs = [
    // проекты
    'https://kb.epam.com/plugins/servlet/applinks/proxy?appId=' + UID + '&path=' + address + '/rest/api/2/project',
    // версии в проектах
    'https://kb.epam.com/plugins/servlet/applinks/proxy?appId=' + UID+'&path=' + address + '/rest/api/2/project/__RPLC__/versions'
  ];
  const item = clickedItem;
  fetch(jiraURLs[0])
    .then(data => data.json())
    .then(data => {
      console.log(">>>> Clicked Link :", clickedItem);

      const projectInfo = data.filter(subItem => subItem.key == item.itemName);
      const projectId = projectInfo[0] ? projectInfo[0].id : ''
      const projectURL = jiraURLs[1].replace('__RPLC__', projectId)
      let header = [];
      const { index: indexOfHeader } = item;
      header = item.stage.split("_");
      console.log(">>>> Stage: ", header, item.stage)

      let urlToOpen = item.element.href;

      fetch(projectURL)
        .then(data => data.json())
        .then(data => {
          const versionInfo = data.filter(subItem => subItem.name == item.projectName);
          const versionId = versionInfo[0].id;
          // console.log(">>>> INFO 2 ::: ", versionInfo, item);

          urlToOpen += "?reporter=" + item.reporter;
          urlToOpen += "&pid=" + projectId;
          urlToOpen += "&issuetype=33";
          urlToOpen += "&priority=3";
          urlToOpen += "&fixVersions=" + versionId;
          urlToOpen += "&assignee=Auto_VTB-DBO_TSKCI";
          urlToOpen += "&summary=Deploy%20" + versionInfo[0].name + "%20to%20" + [header[0]] + "%20" + [header[1]];
          urlToOpen += glueLables([header[0]], "e=");
          urlToOpen += glueLables([header[1]], "n=");
          urlToOpen += glueLables(item.labels);

          window.open(urlToOpen, '_blank');

        })
        .catch((error) => console.log("Shit on me while trying to get Versions; Error: " + error.message))

    })
    .catch((error) => console.log("Shit on me while trying to get Projects; Error: " + error.message))


}

function addHandlerToDeployLinks() {

  $("a[href*='CreateIssueDetails']").each(function() {
    this.addEventListener("click", handleDeployLinkClick);
    $(this).addClass("aui-button");
  });

}

function handleDeployLinkClick(e) {
  e.preventDefault();
  e.stopPropagation();
  const {target} = e;
  const stage = target.innerText;

  const allTd = $(this).closest('tr').children();
  const cnt = allTd.length;
  let index = null;

  for(let i = 0; i < cnt; i++) {

    if(allTd[i] === $(this).closest('td')) {
      index = i;
      console.log(">>>> ", index, allTd[i] === this.parentElement, allTd[i], this.parentElement)
      break;
    }
  }

  const currentItem = {
    element: this,
    itemName: allTd[0].innerText,
    projectName: allTd[1].innerText,
    labels:  allTd[2].innerText.split(" "),
    reporter: $("meta[name='ajs-remote-user']").get(0).content,
    tr: this.parentElement.parentElement,
    index,
    stage,
  };

  runPromisses(currentItem);

}








//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////


setTimeout(getterInfo, 100);

function getterInfo(){
  $.get( 'https://kb.epam.com/rest/jiraanywhere/1.0/servers')
    .done(function(data) {
      console.log(">>>>>>>> DATA: ", data)
      const index = 2;
      const primaryJiraId = data[index] ? data[index].id : null;
      const primaryJiraAddress = data[index] ? data[index].url : null;

      runPromisses(primaryJiraId, primaryJiraAddress);
    })
    .fail(function(err) {
      alert( ">>> Shit on me while trying to get JIRA UID: " + err);
    })
}


function glueLables(ms, prefix) {

  return ms.map((val) => ("&labels=" + (prefix || "") + val)).join("");
}

function runPromisses(UID, address) {

  const jiraURLs = [
    // проекты
    'https://kb.epam.com/plugins/servlet/applinks/proxy?appId=' + UID + '&path=' + address + '/rest/api/2/project',
    // версии в проектах
    'https://kb.epam.com/plugins/servlet/applinks/proxy?appId=' + UID+'&path=' + address + '/rest/api/2/project/__RPLC__/versions'
  ];

  fetch(jiraURLs[0])
    .then(data => data.json())
    .then(data => {
      const allHrefs = getListOfHrefs();

      console.log(">>>> HREFS::: ", allHrefs);

      allHrefs.forEach(item => {
        const projectInfo = data.filter(subItem => subItem.key == item.itemName);
        const projectId = projectInfo[0] ? projectInfo[0].id : ''
        const projectURL = jiraURLs[1].replace('__RPLC__', projectId)
        let header = [];
        const { index: indexOfHeader } = item;
        try {
          const allHeaders = item.tr.parentElement.children[0];
          header = allHeaders.children[indexOfHeader].innerText.split("_");
          console.log(">>>> ITEM", indexOfHeader, allHeaders.children[indexOfHeader], allHrefs[0])
        } catch (e) {
          console.log("Shit on me:: Get Value From Tr Header #2: " + e.message, )
        }

        fetch(projectURL)
          .then(data => data.json())
          .then(data => {
            const versionInfo = data.filter(subItem => subItem.name == item.projectName);
            const versionId = versionInfo[0].id;
            // console.log(">>>> INFO 2 ::: ", versionInfo, item);

            item.element.href += "?reporter=" + item.reporter;
            item.element.href += "&pid=" + projectId;
            item.element.href += "&issuetype=33";
            item.element.href += "&priority=3";
            item.element.href += "&fixVersions=" + versionId;
            item.element.href += "&assignee=Auto_VTB-DBO_TSKCI";
            item.element.href += "&summary=Deploy%20" + versionInfo[0].name + "%20to%20" + [header[0]] + "%20" + [header[1]];
            item.element.href += glueLables([header[0]], "e=");
            item.element.href += glueLables([header[1]], "n=");
            item.element.href += glueLables(item.labels);

            console.log(">>>> GLUE:: ", glueLables(header, "e="), glueLables(item.labels));
          })
          .catch((error) => console.log("Shit on me while trying to get Versions; Error: " + error.message))



      });
    })
    .catch((error) => console.log("Shit on me while trying to get Projects; Error: " + error.message))


}

function getListOfHrefs() {
  const hrefsArr = [];
  const reporter = $("meta[name='ajs-remote-user']").get(0).content;
  $("a[href*='CreateIssueDetails']").each(function() {
    const allTd = this.parentElement.parentElement.children;
    const cnt = allTd.length;
    let index = null;
    for(let i = 0; i < cnt; i++) {

      if(allTd[i] === this.parentElement) {
        index = i;
        console.log(">>>> ", index, allTd[i] === this.parentElement, allTd[i], this.parentElement)
        break;
      }
    }
    hrefsArr.push({
      element: this,
      itemName: allTd[0].innerText,
      projectName: allTd[1].innerText,
      labels:  allTd[2].innerText.split(" "),
      reporter: reporter,
      tr: this.parentElement.parentElement,
      index,
    });
    this.target = "_blank";
    $(this).addClass("aui-button");
  });
  return hrefsArr;
}
