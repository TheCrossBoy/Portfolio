const hideDetails = '<i class="fas fa-caret-up"></i><h3>Hide Details</h3>';
const showDetails = '<i class="fas fa-caret-down"></i><h3>Show Details</h3>'


window.addEventListener("DOMContentLoaded", event => {
	fetch("/data.json").then(res => res.json())
	.then(projectsData => {
		fetch("/assets/mustache.html")
		.then(res => res.text())
		.then(template => {
			for (project of projectsData) {
				if (project["experience"]) {
					rendered = Mustache.render(template, project);
					$("#projects-container").append(rendered);
				}
			}
			
		})
		.then(() => {
			for (const project of $(".project")) {
				const $project = $(project);
				const $details = $project.find(".project-details");
				const $button = $project.find(".project-footer");
		
				$button.click(event => {
					if ($details.css("max-height") == "0px") {
						$details.css("max-height", $details.prop("scrollHeight") + 20);
						$button.html(hideDetails);
					} else {
						$details.css("max-height", 0);
						$button.html(showDetails);
					}
				});
			}
		});
	})
});