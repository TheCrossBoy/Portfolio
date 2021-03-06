const hideDetails = '<i class="fas fa-caret-up"></i><h3>Hide Details</h3>';
const showDetails = '<i class="fas fa-caret-down"></i><h3>Show Details</h3>'


window.addEventListener("DOMContentLoaded", event => {
	fetch("projects.json").then(res => res.json())
	.then(projectsData => {
		fetch("mustache.html")
		.then(res => res.text())
		.then(template => {
			for (project of projectsData) {
				rendered = Mustache.render(template, project);
				$("#projects-container").append(rendered);
			}
			
		})
		.then(() => {
			for (const project of $(".project")) {
				const $project = $(project);
				console.log($project);
				const $details = $project.find(".project-details");
				const $button = $project.find(".project-footer");
		
				$button.click(event => {
					if ($details.css("height") == "0px") {
						$details.css("height", $details.prop("scrollHeight"));
						$button.html(hideDetails);
					} else {
						$details.css("height", 0);
						$button.html(showDetails);
					}
				});
			}
		});
	})
});