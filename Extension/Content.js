let currentUrl = window.location.href;

function reddenPage() {
    let total = 0;

    // Calculate the total watch time
    document
        .querySelectorAll("ytd-playlist-video-renderer .badge-shape-wiz__text")
        .forEach((timeEl) => {
            const split = timeEl.textContent.split(":").reverse();
            split.forEach((t, index) => {
                total += Number(t) * Math.pow(60, index);
            });
        });

    const seconds = total % 60;
    const minutes = Math.floor((total % 3600) / 60);
    const hours = Math.floor(total / 3600);
    const totalDuration = `${hours.toString().padStart(2, "0")}h:${minutes
        .toString()
        .padStart(2, "0")}m:${seconds.toString().padStart(2, "0")}s`;

    // Function to format time based on playback speeds
    function formatTime(durationInSeconds) {
        const s = durationInSeconds % 60;
        const m = Math.floor((durationInSeconds % 3600) / 60);
        const h = Math.floor(durationInSeconds / 3600);
        return `${h.toString().padStart(2, "0")}h:${m.toString().padStart(2, "0")}m:${s.toString().padStart(2, "0")}s`;
    }

    const totalSeconds = total;
    const timeAt1_25x = formatTime(Math.floor(totalSeconds / 1.25));
    const timeAt1_5x = formatTime(Math.floor(totalSeconds / 1.5));
    const timeAt1_75x = formatTime(Math.floor(totalSeconds / 1.75));
    const timeAt2x = formatTime(Math.floor(totalSeconds / 2));
    const timeAt3x = formatTime(Math.floor(totalSeconds / 3));

    const style = `
      <style>
        div.total-duration {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 8px;
          text-align: center;
          font-family: 'Arial', sans-serif;
          color: #fff;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          margin-top: 20px;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
          background: linear-gradient(135deg, rgba(255, 0, 150, 0.1), rgba(0, 204, 255, 0.1));
        }
        div.total-duration h3 {
          font-size: 15px;
          margin-bottom: 20px;
          color: #ff6347;
          font-weight: bold;
        }
        div.total-duration .grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 20px;
        }
        div.total-duration .grid-item {
          background: rgba(255, 255, 255, 0.15);
          padding: 5px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        div.total-duration .grid-item p {
          margin: 0;
          font-size: 10px;
        }
        div.total-duration .grid-item span {
          display: block;
          font-size: 12px;
          font-weight: bold;
          color: #00ccff;
        }
        .time {
          font-size: 16px;
          font-weight: bold;
          padding: 5px;
          border-radius: 6px;
          background: #009963;
          color: white;
        }
        .footer {
          font-size: 12px;
          color: #fff;
          margin-top: 10px;
          padding: 10px;
        }
        .footer a {
          color: yellow;
          font-weight: bolder;
        }
      </style>
    `;

    const htmlContent = `
      <div class="total-duration">
        <h3>Total Watch Time</h3> 
        <span class="time">${totalDuration}</span>
        <div class="grid-container">
          <div class="grid-item">
            <p>1.25x Speed</p>
            <span>${timeAt1_25x}</span>
          </div>
          <div class="grid-item">
            <p>1.5x Speed</p>
            <span>${timeAt1_5x}</span>
          </div>
          <div class="grid-item">
            <p>1.75x Speed</p>
            <span>${timeAt1_75x}</span>
          </div>
          <div class="grid-item">
            <p>2x Speed</p>
            <span>${timeAt2x}</span>
          </div>
          <div class="grid-item">
            <p>3x Speed</p>
            <span>${timeAt3x}</span>
          </div>
        </div>
        <div>
          <p class="footer">Made with <span class="heart">❤</span> by <a href="https://github.com/siddhakdak"><span>Siddhak Dak</span></a> || @2024</p>
        </div>
      </div>
    `;

    // Insert the HTML after the target element
    const targetElement = document.querySelectorAll(".page-header-view-model-wiz__page-header-headline-info")[3];
    if (targetElement) {
        targetElement.insertAdjacentHTML("afterend", `${htmlContent}${style}`);
    }
}

// Function to handle playlist detection
function handlePageChange() {
    const existingDuration = document.querySelector(".total-duration");
    if (existingDuration) {
        existingDuration.remove();
    }
    reddenPage();
}

// Polling function to check if the URL has changed
setInterval(() => {
    if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        if (currentUrl.includes("playlist?list=")) {
            handlePageChange();
        }
    }
}, 1000); // Check every 1 second

// Initial check on page load
if (window.location.href.includes("playlist?list=")) {
    handlePageChange();
}
