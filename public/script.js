// data fetching
const inputTextDOM = document.getElementById("inputTitle");
const inputContentDOM = document.getElementById("inputContent");
const formDOM = document.querySelector(".form-section");
const threadSectionDOM = document.querySelector(".thread-section");
let inputText = "";
let contentText = "";

const getAllThreads = async () => {
  try {
    let allThreads = await axios.get("/api/v1/threads");
    let { data } = allThreads;
    allThreads = data
      .sort((a, b) => new Date(b.postDate) - new Date(a.postDate))
      .map((thread) => {
        const { title, content, postDate } = thread;
        return `
          <div class="single-thread">
            <h2>${title}</h2>
            <h3>${content}</h3>
            <p>${postDate}</p>
          </div>
        `;
      })
      .join("");
    threadSectionDOM.innerHTML = allThreads;
  } catch (err) {
    console.log(err);
  }
};

getAllThreads();

inputTextDOM.addEventListener("change", (e) => {
  inputText = e.target.value;
});
inputContentDOM.addEventListener("change", (e) => {
  contentText = e.target.value;
});

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const date = new Date();
  const japanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const year = japanTime.getFullYear();
  const month = japanTime.getMonth() + 1;
  const day = japanTime.getDate();
  const dateString = year + "/" + month + "/" + day;
  if (inputText && contentText) {
    try {
      await axios.post("/api/v1/threads", {
        title: inputText,
        content: contentText,
        postDate: dateString,
      });
      inputText = "";
      contentText = "";
      inputTextDOM.value = "";
      inputContentDOM.value = "";
      getAllThreads();
    } catch (err) {
      console.log(err);
    }
  }
});
