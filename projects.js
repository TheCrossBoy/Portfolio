const hideDetails = '<i class="fas fa-caret-up"></i><h3>Hide Details</h3>';
const showDetails = '<i class="fas fa-caret-down"></i><h3>Show Details</h3>'


window.addEventListener("DOMContentLoaded", event => {
	fetch("projects.json").then(res => res.json())
	.then(projectsData => {
		fetch("project-mustache.html")
		.then(res => res.text())
		.then(template => {
			rendered = Mustache.render(template, projectsData[0]);
			console.log(rendered)
			$("#projects-container").append(rendered);
		})
		.then(() => {
			for (const project of $(".project")) {
				const $project = $(project);
				console.log($project);
				$details = $project.find(".project-details");
				$button = $project.find(".project-footer");
		
				$button.click(event => {
					if ($details.css("height") == "0px") {
						$(".project-details").css("height", $(".project-details").prop("scrollHeight"));
						$button.html(hideDetails);
					} else {
						$(".project-details").css("height", 0);
						$button.html(showDetails);
					}
				});
			}
		});
	})
});