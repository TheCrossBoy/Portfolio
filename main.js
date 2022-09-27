window.addEventListener("DOMContentLoaded", event => {
	fetch("/data.json").then(res => res.json())
	.then(data => {
		let languages = new Set();
		let tags = new Set();

		for (block of data) {
			for (language of block["languages"])
				languages.add(language)
			for (tag of block["tags"])
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
				lang.classList.add("clickable")
				lang.innerText = language

				const link = document.createElement("a")
				link.href = "/filter/languages/" + language
				link.appendChild(lang)

				languageList.appendChild(link)
			}

			$("#home-langs").append(languageList)
		}

		if (tags.length > 0) {
			const tagList = document.createElement("ul")
			tagList.classList.add("project-tags")

			for (tag of tags) {
				const tagE = document.createElement("li")
				tagE.classList.add("tag")
				tagE.classList.add("clickable")
				tagE.innerText = tag

				const link = document.createElement("a")
				link.href = "/filter/tags/" + tag
				link.appendChild(tagE)

				tagList.appendChild(link)
			}

			$("#home-tags").append(tagList)
		}
	})
})