const hideDetails = '<i class="fas fa-caret-up"></i><h3>Hide Details</h3>';
const showDetails = '<i class="fas fa-caret-down"></i><h3>Show Details</h3>'

const data = {};
const languages = new Set();
const tags = new Set();

const cur_properties = {};

function filter(properties) {
	for (const container of $(".project")) {
		const $project = $(container);
		const projectData = data[$project.attr("name")];

		include = true;
		for (const f of Object.values(properties)) {
			if (!f(projectData)) {
				include = false;
				break;
			}
		}

		if (include) {
			$project.show()
		} else {
			$project.hide()
		}
	}
}


window.addEventListener("DOMContentLoaded", event => {
	fetch("/data.json").then(res => res.json())
	.then(rawData => {
		fetch("/assets/mustache.html")
		.then(res => res.text())
		.then(template => {
			for (block of rawData) {
				rendered = Mustache.render(template, block);
				
				data[block["title"]] = block;

				for (language of block["languages"])
					languages.add(language)
				for (tag of block["tags"])
					tags.add(tag)

				$("#projects-container").append(rendered);
			}
			
		})
		.then(() => {
			for (const project of $(".project")) {
				const $project = $(project);
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
				})
			}

			$projects = $("#filter_projects")[0];
			$experience = $("#filter_experience")[0];
			$("#checkboxes > input[type=checkbox]").change(e => {
				cur_properties["type"] = b => $projects.checked && b["project"] || $experience.checked && b["experience"];
				filter(cur_properties);
			});

			$lang_container = $("#filter-languages");
			for (const lang of languages) {
				$lang_container.append($(`<li class="tag language clickable">${lang}</li>`).click(e => {
					$e = $(e.target);
					$e.toggleClass("selected");

					if ($e.hasClass("selected")) {
						cur_properties[lang] = b => b.languages.includes(lang);
					} else {
						delete cur_properties[lang]
					}

					filter(cur_properties);
				}));
			}

			$tag_container = $("#filter-tags");
			for (const tag of tags) {
				$tag_container.append($(`<li class="tag clickable">${tag}</li>`).click(e => {
					$e = $(e.target);
					$e.toggleClass("selected");
					
					if ($e.hasClass("selected")) {
						cur_properties[tag] = b => b.tags.includes(tag);
					} else {
						delete cur_properties[tag]
					}

					filter(cur_properties);
				}));
			}
		})
	})
	.then(() => {
		
		
		
	})
});