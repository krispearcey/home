const blogPosts = [
  {
    id: "building-calm-products",
    title: "Building calm digital products",
    subtext: "How whitespace, rhythm, and restraint make interfaces feel better.",
    date: "March 2026",
    content: `
      <h1>Building calm digital products</h1>
      <p class="post-meta">March 2026 · 4 min read</p>

      <p>
        Some interfaces demand attention every second. Others quietly support the
        work you are trying to do. The difference is often not features, but tone.
      </p>

      <p>
        Calm products are not empty products. They are carefully edited. They use
        spacing, typography, and contrast to reduce friction and help users focus
        on the thing that matters most.
      </p>

      <h2>Whitespace is functional</h2>
      <p>
        Whitespace gives information room to breathe. It creates hierarchy,
        improves readability, and makes the interface feel intentional rather than
        crowded.
      </p>

      <h2>Speed supports flow</h2>
      <p>
        Tiny delays accumulate. A fast, responsive interface lets people stay in
        thought instead of noticing the tool.
      </p>

      <h2>Less, but more considered</h2>
      <p>
        The goal is not minimalism for its own sake. The goal is clarity.
        Restraint helps the important pieces feel more meaningful.
      </p>
    `
  },
  {
    id: "why-micro-journaling-works",
    title: "Why micro journaling works",
    subtext: "A lighter daily writing habit can be easier to keep and more useful over time.",
    date: "February 2026",
    content: `
      <h1>Why micro journaling works</h1>
      <p class="post-meta">February 2026 · 3 min read</p>

      <p>
        Long-form journaling can be powerful, but it can also be intimidating.
        Micro journaling lowers the barrier to entry. A few lines are often enough
        to capture a meaningful moment.
      </p>

      <p>
        Over time, those small notes become patterns. You start noticing where you
        were happiest, what routines helped, and which people or places kept
        showing up.
      </p>

      <h2>Consistency beats intensity</h2>
      <p>
        A habit that takes one minute is easier to keep than a habit that takes
        thirty. Small entries are often the difference between starting and not
        starting.
      </p>

      <h2>Patterns emerge later</h2>
      <p>
        A single entry may feel insignificant, but dozens of small entries can
        reveal surprisingly useful insight.
      </p>
    `
  },
  {
    id: "designing-for-focus",
    title: "Designing for focus",
    subtext: "The best writing tools fade into the background and let thinking take over.",
    date: "January 2026",
    content: `
      <h1>Designing for focus</h1>
      <p class="post-meta">January 2026 · 5 min read</p>

      <p>
        Focus is fragile. A writing interface should protect it. That means fewer
        competing elements, fewer decorative distractions, and a layout that feels
        stable from the first second.
      </p>

      <p>
        Strong focus-oriented design often comes from removing uncertainty:
        consistent spacing, obvious hierarchy, and interactions that feel natural.
      </p>

      <h2>Typography matters</h2>
      <p>
        Good type reduces effort. It lets your eyes move smoothly and helps
        paragraphs feel approachable rather than dense.
      </p>

      <h2>Structure builds trust</h2>
      <p>
        When a product behaves predictably, users can think about their content
        instead of the interface.
      </p>
    `
  }
];

const projects = [
  {
    category: "Concept",
    title: "Journalistic",
    description:
      "A minimalist micro-journaling interface focused on clarity, quiet layouts, and elegant reading and writing.",
    linkText: "View concept"
  },
  {
    category: "UI System",
    title: "Calm Interface Library",
    description:
      "A reusable design system with soft surfaces, restrained contrast, and typography-led components for editorial products.",
    linkText: "Open system"
  },
  {
    category: "Writing Tool",
    title: "Draft Flow",
    description:
      "An editor experiment centered around distraction-free text entry, subtle hierarchy, and pleasant composition rhythm.",
    linkText: "Read more"
  },
  {
    category: "Personal Project",
    title: "Micro Notes Archive",
    description:
      "A searchable archive of short-form reflections, daily observations, and recurring themes gathered over time.",
    linkText: "Explore archive"
  }
];

const modalTriggers = document.querySelectorAll(".nav-trigger");
const modals = document.querySelectorAll(".screen-modal");
const closeButtons = document.querySelectorAll(".close-modal");

function openModal(modalId) {
  modals.forEach((modal) => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  });

  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const scrollArea = modal.querySelector(".modal-scroll");
  if (scrollArea) scrollArea.scrollTop = 0;
}

function closeAllModals() {
  modals.forEach((modal) => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  });
  document.body.classList.remove("modal-open");
}

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openModal(trigger.dataset.modal);
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", closeAllModals);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllModals();
});

/* BLOG RENDERING */
const blogList = document.getElementById("blogList");
const blogListView = document.getElementById("blogListView");
const blogPostView = document.getElementById("blogPostView");
const blogPostContent = document.getElementById("blogPostContent");
const backToBlogList = document.getElementById("backToBlogList");

function renderBlogList() {
  blogList.innerHTML = "";

  blogPosts.forEach((post) => {
    const button = document.createElement("button");
    button.className = "blog-card";
    button.innerHTML = `
      <h3 class="blog-card-title">${post.title}</h3>
      <p class="blog-card-subtext">${post.subtext}</p>
    `;
    button.addEventListener("click", () => openBlogPost(post.id));
    blogList.appendChild(button);
  });
}

function openBlogPost(postId) {
  const post = blogPosts.find((item) => item.id === postId);
  if (!post) return;

  blogPostContent.innerHTML = post.content;
  blogListView.classList.add("hidden");
  blogPostView.classList.remove("hidden");

  const blogModalScroll = document.querySelector("#blogModal .modal-scroll");
  if (blogModalScroll) blogModalScroll.scrollTop = 0;
}

backToBlogList.addEventListener("click", () => {
  blogPostView.classList.add("hidden");
  blogListView.classList.remove("hidden");

  const blogModalScroll = document.querySelector("#blogModal .modal-scroll");
  if (blogModalScroll) blogModalScroll.scrollTop = 0;
});

/* PROJECTS RENDERING */
const projectsGrid = document.getElementById("projectsGrid");

function renderProjects() {
  projectsGrid.innerHTML = "";

  projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.innerHTML = `
      <div>
        <div class="project-meta">${project.category}</div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
      </div>
      <a href="#" class="project-link">
        <span>${project.linkText}</span>
        <span>↗</span>
      </a>
    `;
    projectsGrid.appendChild(card);
  });
}

renderBlogList();
renderProjects();
