(function () {
  function readJsonScript(id) {
    var node = document.getElementById(id)
    if (!node) {
      return null
    }

    try {
      return JSON.parse(node.textContent)
    } catch (error) {
      console.error("Failed to parse JSON from", id, error)
      return null
    }
  }

  if (!window.React || !window.ReactDOM || !window.ReactDOM.createRoot) {
    return
  }

  var React = window.React
  var ReactDOM = window.ReactDOM
  var h = React.createElement

  function resolveUrl(url, baseUrl) {
    if (!url || /^(https?:|mailto:|tel:|#)/.test(url)) {
      return url
    }

    if (!baseUrl) {
      return url
    }

    if (url.charAt(0) === "/") {
      return baseUrl + url
    }

    return url
  }

  function normalizePath(path) {
    if (!path) {
      return "/"
    }

    var normalized = path.replace(/index\.html$/, "")
    if (!normalized.endsWith("/")) {
      normalized += "/"
    }
    return normalized
  }

  function getLinkProps(url, baseUrl) {
    var href = resolveUrl(url, baseUrl)
    if (/^(https?:|mailto:|tel:)/.test(href || "")) {
      return {
        href: href,
        target: "_blank",
        rel: "noreferrer"
      }
    }

    return { href: href }
  }

  function ActionLink(props) {
    var classes = "button-link button-link--" + (props.style || "secondary")
    return h(
      "a",
      Object.assign(
        {
          className: classes
        },
        getLinkProps(props.url, props.baseUrl)
      ),
      props.label
    )
  }

  function SocialLink(props) {
    var icons = {
      email: "fas fa-envelope",
      github: "fab fa-github",
      linkedin: "fab fa-linkedin",
      scholar: "fas fa-graduation-cap"
    }

    return h(
      "a",
      Object.assign(
        {
          className: "social-link",
          "aria-label": props.label
        },
        getLinkProps(props.url, props.baseUrl)
      ),
      h("i", { className: icons[props.type] || "fas fa-link" })
    )
  }

  function HighlightCard(props) {
    return h("article", { className: "highlight-card" }, [
      h("h3", { key: "title" }, props.title),
      h("p", { key: "text" }, props.text),
      h(
        "a",
        Object.assign(
          {
            key: "link",
            className: "inline-link"
          },
          getLinkProps(props.linkUrl, props.baseUrl)
        ),
        props.linkLabel
      )
    ])
  }

  function LanguageCard(props) {
    return h("article", { className: "language-item" }, [
      h("h3", { key: "title" }, props.name),
      h("p", { key: "detail" }, props.detail)
    ])
  }

  function PhotoCard(props) {
    var className = "photo-card"
    if (!props.image) {
      className += " photo-card--placeholder"
      if (props.theme) {
        className += " photo-card--" + props.theme
      }
    }

    return h("article", { className: className }, [
      props.image
        ? h("div", { className: "photo-media", key: "media" }, [
            h("img", {
              src: resolveUrl(props.image, props.baseUrl),
              alt: props.alt || props.title
            })
          ])
        : h(
            "div",
            {
              className: "photo-placeholder",
              key: "placeholder"
            },
            props.meta
          ),
      h("div", { className: "photo-copy", key: "copy" }, [
        h("p", { className: "card-eyebrow", key: "meta" }, props.meta),
        h("h3", { key: "title" }, props.title),
        h("p", { key: "description" }, props.description)
      ])
    ])
  }

  function HomeApp(props) {
    var data = props.data || {}
    var baseUrl = props.baseUrl || ""
    var hero = data.hero || {}
    var focus = data.focus || {}
    var languages = data.languages || {}
    var photography = data.photography || {}

    return h("div", { className: "home-shell" }, [
      h("section", { className: "hero-card", key: "hero" }, [
        h("div", { className: "hero-copy", key: "copy" }, [
          h("p", { className: "section-kicker", key: "kicker" }, "Personal Site"),
          h(
            "div",
            { className: "hero-badge-row", key: "badges" },
            (hero.badges || []).map(function (badge) {
              return h("span", { className: "hero-badge", key: badge }, badge)
            })
          ),
          h(
            "h1",
            { className: "hero-title", key: "title" },
            [hero.name, hero.native_name].filter(Boolean).join(" ")
          ),
          h("p", { className: "hero-role", key: "role" }, hero.role),
          h("p", { className: "lead", key: "intro" }, hero.intro),
          h(
            "div",
            { className: "hero-action-row", key: "actions" },
            (hero.links || []).map(function (link) {
              return h(ActionLink, {
                key: link.label,
                label: link.label,
                url: link.url,
                style: link.style,
                baseUrl: baseUrl
              })
            })
          ),
          h(
            "div",
            { className: "social-link-row", key: "social" },
            (hero.social || []).map(function (item) {
              return h(SocialLink, {
                key: item.label,
                type: item.type,
                label: item.label,
                url: item.url,
                baseUrl: baseUrl
              })
            })
          ),
          h(
            "div",
            { className: "hero-stats", key: "stats" },
            (hero.metrics || []).map(function (metric) {
              return h("article", { className: "hero-stat", key: metric.label }, [
                h("strong", { key: "value" }, metric.value),
                h("span", { key: "label" }, metric.label)
              ])
            })
          )
        ]),
        h("div", { className: "hero-visual", key: "visual" }, [
          h("div", { className: "hero-portrait-frame", key: "portrait" }, [
            h("img", {
              src: resolveUrl(hero.portrait, baseUrl),
              alt: hero.portrait_alt || hero.name
            })
          ]),
          h(
            "p",
            { className: "hero-location", key: "location" },
            "Based in " + (hero.location || "Singapore")
          )
        ])
      ]),
      h("section", { className: "section-card", key: "focus" }, [
        h("p", { className: "section-kicker", key: "kicker" }, "What I Do"),
        h("h2", { key: "title" }, focus.title),
        h("p", { className: "section-intro", key: "intro" }, focus.intro),
        h(
          "div",
          { className: "highlight-grid", key: "grid" },
          (focus.items || []).map(function (item) {
            return h(HighlightCard, {
              key: item.title,
              title: item.title,
              text: item.text,
              linkLabel: item.link_label,
              linkUrl: item.link_url,
              baseUrl: baseUrl
            })
          })
        )
      ]),
      h("section", { className: "section-card", id: "languages", key: "languages" }, [
        h("p", { className: "section-kicker", key: "kicker" }, "Languages"),
        h("h2", { key: "title" }, languages.title),
        h("p", { className: "section-intro", key: "intro" }, languages.intro),
        h(
          "div",
          { className: "language-grid", key: "grid" },
          (languages.items || []).map(function (item) {
            return h(LanguageCard, {
              key: item.name,
              name: item.name,
              detail: item.detail
            })
          })
        )
      ]),
      h("section", { className: "section-card", id: "photography", key: "photography" }, [
        h("p", { className: "section-kicker", key: "kicker" }, "Photography"),
        h("h2", { key: "title" }, photography.title),
        h("p", { className: "section-intro", key: "intro" }, photography.intro),
        h(
          "div",
          { className: "photo-grid", key: "grid" },
          (photography.items || []).map(function (item) {
            return h(PhotoCard, {
              key: item.title,
              title: item.title,
              meta: item.meta,
              description: item.description,
              image: item.image,
              alt: item.alt,
              theme: item.theme,
              baseUrl: baseUrl
            })
          })
        )
      ])
    ])
  }

  function SiteNav(props) {
    var data = props.data || {}
    var currentPath = normalizePath(data.currentPath)
    var baseUrl = data.baseUrl || ""
    var _useState = React.useState(false)
    var open = _useState[0]
    var setOpen = _useState[1]

    return h("nav", { className: "site-nav", "aria-label": "Primary" }, [
      h(
        "a",
        {
          className: "site-brand",
          href: resolveUrl("/", baseUrl)
        },
        [
          h("span", { className: "site-brand-mark", key: "mark" }, "LY"),
          h("span", { className: "site-brand-text", key: "text" }, [
            h("strong", { key: "name" }, data.author || data.title || "Site"),
            h("span", { key: "tagline" }, "Machine Learning · Research · Teaching")
          ])
        ]
      ),
      h(
        "button",
        {
          type: "button",
          className: "site-nav-toggle",
          "aria-expanded": open ? "true" : "false",
          "aria-label": open ? "Close navigation menu" : "Open navigation menu",
          onClick: function () {
            setOpen(!open)
          }
        },
        open ? "Close" : "Menu"
      ),
      h(
        "div",
        {
          className: "site-nav-links" + (open ? " is-open" : "")
        },
        (data.nav || []).map(function (item) {
          var href = resolveUrl(item.url, baseUrl)
          var active = normalizePath(href.replace(baseUrl, "") || href) === currentPath
          return h(
            "a",
            {
              key: item.title,
              href: href,
              className: active ? "is-active" : "",
              "aria-current": active ? "page" : undefined,
              onClick: function () {
                setOpen(false)
              }
            },
            item.title
          )
        })
      )
    ])
  }

  var shellData = readJsonScript("site-shell-data")
  var navRoot = document.getElementById("site-nav-root")
  if (shellData && navRoot) {
    ReactDOM.createRoot(navRoot).render(h(SiteNav, { data: shellData }))
  }

  var homeData = readJsonScript("home-data")
  var homeRoot = document.getElementById("home-app")
  if (homeData && homeRoot) {
    ReactDOM.createRoot(homeRoot).render(
      h(HomeApp, {
        data: homeData,
        baseUrl: shellData ? shellData.baseUrl : ""
      })
    )
  }
})()
