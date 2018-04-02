var viewModel = {
    teams: ko.observable([]),
    employees: ko.observable([]),
    projects: ko.observable([])
};

function showGenericModal(title, message) {
    let modalTitle = $(".modal-title");
    let modalBody = $(".modal-body");

    modalTitle.empty();
    modalBody.empty();

    modalTitle.html(title);
    modalBody.html(message);
    $('#genericModal').modal('show');
}

function initializeTeam(){
    return new Promise(function(resolve, reject){
        $.ajax({
            url:"https://radiant-lake-28462.herokuapp.com/teams-raw",
            type: "GET",
            contentType: "application/json"
        })
        .done(function(data){
            viewModel["teams"] = ko.mapping.fromJS(data);
            resolve();
        })
        .fail(function(){
            reject("Error loading the team data.");
        })
    });
}

function initializeEmployees(){
    return new Promise(function(resolve, reject){
        $.ajax({
            url:"https://radiant-lake-28462.herokuapp.com/employees",
            type: "GET",
            contentType: "application/json"
        })
        .done(function(data){
            viewModel["employees"] = ko.mapping.fromJS(data);
            resolve();
        })
        .fail(function(){
            reject("Error loading the employee data.");
        })
    });
}

function initializeProjects(){
    return new Promise(function(resolve, reject){
        $.ajax({
            url:"https://radiant-lake-28462.herokuapp.com/Projects",
            type: "GET",
            contentType: "application/json"
        })
        .done(function(data){
            viewModel["projects"] = ko.mapping.fromJS(data);
            resolve();
        })
        .fail(function(){
            reject("Error loading the projects data.");
        })
    });
}

function saveTeam(){
    let currentTeam = ko.mapping.toJS(this);
    $.ajax({
        url:"https://radiant-lake-28462.herokuapp.com/team/" + currentTeam._id,
        type: "PUT",
        data: JSON.stringify({
            Projects: currentTeam.Projects,
            Employees: currentTeam.Employees,
            TeamLead: currentTeam.TeamLead
        }),
        contentType: "application/json"
    })
    .done(function(){
        showGenericModal("Success", currentTeam.TeamName + "Updated Successfully");
    })
    .fail(function(){
        showGenericModal("Error", "Error updating the team information");
    });
}

$(function(){                                        
    initializeTeam().then(function(){
        initializeEmployees().then(function(){
            initializeProjects().then(function(){
                ko.applyBindings(viewModel, $("html")[0]);
                $("select.multiple").multipleSelect( {filter:true});
                $("select.single").multipleSelect( {single:true, filter:true});

                $(".loader").remove(); // remove the loader when page is ready
            })
        })
    })
    .catch(function(err){
        showGenericModal("Error", err);
    });
    
})

