const hideDetails = '<i class="fas fa-caret-up"></i><h3>Hide Details</h3>';
const showDetails = '<i class="fas fa-caret-down"></i><h3>Show Details</h3>'

// Globals with just data in different formats
const data = {};
const languages = new Set();
const tags = new Set();

// All filters currently applied
let cur_filters = {
	type: b => $projects.checked && b["project"] || $experience.checked && b["experience"]
};

// Used for URL construction
const url_tag_filters = new Set();
const url_lang_filters = new Set();

function set_defaults() {
	$(".tag").removeClass("selected");
	$("input:checkbox.filter_type").prop("checked", true);
	cur_filters = {
		type: b => $projects.checked && b["project"] || $experience.checked && b["experience"]
	};
	url_tag_filters.clear();
	url_lang_filters.clear();
}

// Filter using our current filters and update the URL
function filter() {
	for (const container of $(".project")) {
		const $project = $(container);
		const projectData = data[$project.attr("name")];

		include = true;
		for (const f of Object.values(cur_filters)) {
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

	let url = "/filter/".concat(
		!$("#filter_projects").prop("checked") ? "exclude/projects/" : "",
		!$("#filter_experience").prop("checked") ? "exclude/experience/" : "",
		url_lang_filters.size != 0 ? "languages/" + Array.from(url_lang_filters.values()).join("/") + "/" : "",
		url_tag_filters.size != 0 ? "tags/" + Array.from(url_tag_filters.values()).join("/") + "/" : ""
	);
	console.log(url);
	window.history.pushState(null, "", url);
}


window.addEventListener("DOMContentLoaded", event => {
	fetch("/data.json").then(res => res.json())
	.then(rawData => {
		fetch("/assets/mustache.html")
		.then(res => res.text())
		.then(template => {
			// Construct data
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
			// Load URL's filter settings
			const params = window.location.pathname.slice(8).split("/").map(decodeURIComponent).filter(p => p != "");

			function isTag(t) {
				return t != "tags" && t != "languages" && t != "exclude";
			}
			for (let i = 0; i < params.length; i++) {
				const param = params[i];
				switch (param) {
					case "tags":
						console.log("Tags:");
						while (++i < params.length) {
							if (!isTag(params[i])) {
								i--;
								break;
							}

							console.log(params[i]);
							url_tag_filters.add(params[i]);
						}
						break;
					case "languages":
						console.log("Languages:");
						while (++i < params.length) {
							if (!isTag(params[i])) {
								i--;
								break;
							}

							console.log(params[i]);
							url_lang_filters.add(params[i]);
						}
						break;
					case "exclude":
						const type = params[++i];
						if (type == "projects") {
							console.log("Excluding projects");
							$("#filter_projects").click();
						} else if (type == "experience") {
							console.log("Excluding experience");
							$("#filter_experience").click();
						}
						break;
					default:
						break;
				}
			}

			// Build projects
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

			// Type filter
			$projects = $("#filter_projects")[0];
			$experience = $("#filter_experience")[0];
			$("#checkboxes > input:checkbox").change(e => {
				filter();
			});

			// Language filter
			$lang_container = $("#filter-languages");
			for (const lang of languages) {
				let selected = "";
				if (url_lang_filters.has(lang)) {
					selected = "selected";
					cur_filters[lang] = b => b.languages.includes(lang);
				}

				$lang_container.append($(`<li class="tag language clickable ${selected}">${lang}</li>`).click(e => {
					$e = $(e.target);
					$e.toggleClass("selected");

					if ($e.hasClass("selected")) {
						cur_filters[lang] = b => b.languages.includes(lang);
						url_lang_filters.add(lang);
					} else {
						delete cur_filters[lang];
						url_lang_filters.delete(lang);
					}

					filter();
				}));
			}

			// Tag filter
			$tag_container = $("#filter-tags");
			for (const tag of tags) {
				let selected = "";
				if (url_tag_filters.has(tag)) {
					selected = "selected";
					cur_filters[tag] = b => b.tags.includes(tag);
				}

				$tag_container.append($(`<li class="tag clickable ${selected}">${tag}</li>`).click(e => {
					$e = $(e.target);
					$e.toggleClass("selected");
					
					if ($e.hasClass("selected")) {
						cur_filters[tag] = b => b.tags.includes(tag);
						url_tag_filters.add(tag);
					} else {
						delete cur_filters[tag];
						url_tag_filters.delete(tag);
					}

					filter();
				}));
			}

			// Clear all filters
			$("#filter-clear").click(e => {
				set_defaults();
				filter();
				console.log("Cleared all filters");
			});


			// Apply all current filters
			filter();
		})
	})
	.then(() => {
		
		
		
	})
});