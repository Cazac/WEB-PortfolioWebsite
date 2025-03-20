function pageLoadingTimeout() {
	setTimeout(showPage, 500);
}
  
function showPage() {
	document.getElementById("loader").style.display = "none";
	document.getElementById("myDiv").style.display = "block";
}

// Function to append current search params to the href
function appendSearchParamsToAllhrefs() {

	// Get the login search params from the URL
	var searchParams = window.location.search;

	// Select all anchor elements on the page
	var links = document.querySelectorAll('a');

	// Iterate through the list and check if each link exists and is valid
	links.forEach(link => {
		
		// Exclude carousel links and mailto links
		if (link.href && !link.href.includes('#slides') && !link.href.startsWith('mailto:')) {
		// Append the search params to the href
		link.href += searchParams;
		}
		else {
		console.log(`Skipping link: ${link.href}`);
		}
	});
}

function CheckRarDownloads() {

	const urlId = new URLSearchParams(window.location.search).get('id');
	if (urlId)
	{
		const userId = urlId.split('-')[0];
		var userPassword = urlId.split('-')[1];

		if (userId && userPassword)
		{ 
		var rarFilePath = "https://raw.githubusercontent.com/Cazac/WEB-PortfolioWebsite/main/images/Protected/" + userId + ".rar";
		kickoffRarDownloaderSetup(rarFilePath, userPassword);
		}
	}
	else {
		console.log("No urlId found");
	}
}

function handleImagesInIndex(images) {

	const imageElements = document.querySelectorAll('.carousel-item img');
	const imageMap = {};

	// Create a mapping of filenames to image elements by name to be searched later
	imageElements.forEach(img => {
		const src = img.src.split('/').pop(); 
		imageMap[src] = img;
	});

	console.log("Image Map:", imageMap);
	console.log("Images Array:", images);

	images.forEach(image => {
		// Search by original filename
		const imageName = image.name; 
		const imgElement = imageMap[imageName];

		if (imgElement) {
		console.log("Replacing image:", imageName);
		imgElement.src = URL.createObjectURL(image);
		} else {
		console.log("Image not found in carousel:", imageName);
		}
	});
}

// Factory function to create project tile cards
function createProjectTileCard(project) {
	const { href, imageUrl, title, tags, bannerUrl, inlineStyle } = project;

	const tileCard = document.createElement('div');
	tileCard.className = 'col-sm-12 col-md-6 col-lg-6 col-xl-3';

	if (href != "") {
		tileCard.innerHTML = `
		<div class="tile-item-container">
		  <div class="smalldropshadow">
			<a href="${href}">
			  <div class="tile-item" style="'${inlineStyle}'">
				<div class="tile-item-bg" style="background-image: url('${imageUrl}')"></div>
				<div class="tile-item-title-container">
				  <div class="tile-item-title">
					<span>${title}</span>
				  </div>
				</div>
			  </div>
			</a>
		  </div>
		  ${bannerUrl ? `<img class="corner-banner-overlay" src="${bannerUrl}" />` : ''}
		  <div class="tile-item-tags-container">
			${tags.map(tag => `<div class="tile-item-tag ${tag.class} minidropshadow"><span>${tag.label}</span></div>`).join('')}
		  </div>
		</div>
	  `;
	}
	else {
		tileCard.innerHTML = `
		<div class="tile-item-container">
		  <div class="smalldropshadow">
			  <div class="tile-item" style="opacity: 0.4;">
				<div class="tile-item-bg" style="background-image: url('${imageUrl}')"></div>
				<div class="tile-item-title-container">
				  <div class="tile-item-title">
					<span>${title}</span>
				  </div>
				</div>
			  </div>
		  </div>
		  ${bannerUrl ? `<img class="corner-banner-overlay" src="${bannerUrl}" />` : ''}
		  <div class="tile-item-tags-container">
			${tags.map(tag => `<div class="tile-item-tag ${tag.class} minidropshadow"><span>${tag.label}</span></div>`).join('')}
		  </div>
		</div>
	  `;
	}

	

	return tileCard;
  }