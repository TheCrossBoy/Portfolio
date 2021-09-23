window.addEventListener("DOMContentLoaded", event => {
	fetch("experience.json").then(res => res.json())
	.then(experienceData => {
		fetch("projects.json")
		.then(res => res.json())
		.then(projectData => {
			let languages = new Set();
			let tags = new Set();

			for (experience of experienceData) {
				for (language of experience["languages"])
					languages.add(language)
				for (tag of experience["tags"])
					tags.add(tag)
			}

			for (project of projectData) {
				for (language of project["languages"])
					languages.add(language)
				for (tag of project["tags"])
					tags.add(tag)
			}

			languages = Array.from(languages).sort()
			tags = Array.from(tags).sort()

			if (languages.length > 0) {
				const languageList = document.createElement("ul")
				languageList.classList.add("project-tags")

				for (language of languages) {
					const lang = document.createElement("li")
					lang.classList.add("tag")
					lang.classList.add("language")
					lang.innerText = language
					languageList.appendChild(lang)
				}

				$("#langs").after(languageList)
			}

			if (tags.length > 0) {
				const tagList = document.createElement("ul")
				tagList.classList.add("project-tags")

				for (tag of tags) {
					const tagE = document.createElement("li")
					tagE.classList.add("tag")
					tagE.innerText = tag
					tagList.appendChild(tagE)
				}

				$("#tags").after(tagList)
			}
		})
	})
})