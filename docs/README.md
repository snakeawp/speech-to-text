📢 Use this project, [contribute](https://github.com/{OrganizationName}/{AppName}) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Speech to Text Search

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

This app **uses Google Chrome language processing** to listen with the microphone and return as a result a word. With that **result** the component redirects to the search page using it as a parameter.
Under the app's name, you should explain the topic, giving a **brief description** of its **functionality** in a store when installed.

![speechlow](https://user-images.githubusercontent.com/23383993/127346535-62a7546b-accd-468b-adfa-3495cabe64b9.gif)

## Configuration 

1. Adding the app as a theme dependency in the `manifest.json` file;
2. Declaring the app's main block in a given theme template or inside another block from the theme. For example:

````
  "flex-layout.col#text-speech": {
    "children": [
      "speech-to-text"
    ]
  },
````

And then add the needed configuration:

```
 "speech-to-text": {
    "props": {
      "lang": "es-ES",
      "iconHeight": "20px",
      "iconWidth": "20px",
      "imgSrc": "https://upload.wikimedia.org/wikipedia/commons/a/a7/Font_Awesome_5_solid_microphone.svg"
    }
  }
```

Next, add the **props table** containing your block's props. 

If the app exports more than one block, create several tables - one for each block. For example:

### `speech-to-text` props

| Prop name    | Type            | Description    | Default value                                                                                                                               |
| ------------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | 
| `lang`      | `enum`       | Defines the language that will be used by the Google Chrome NLP API         | `en-EN`        |
| `iconHeight`      | `string`       | Defines the icon height in px         | `20px`        |
| `iconWidth`      | `string`       | Defines the icon width in px         | `20px`        |
| `imgSrc`      | `string`       | Defines the link to the image to be shown         | `none`        |


Remember to also use this Configuration section to  **showcase any necessary disclaimer** related to the app and its blocks, such as the different behavior it may display during its configuration. 

#
## Customization
`In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).`

| CSS Handles |
| ----------- | 
| `audioSearchContainer` | 
| `audioSearchImg` | 
| `audioSearchImgRecordingState` | 


<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
[Fabricio Vagliente](https://github.com/Favri)
<table>
  <tr>
    <td align="center"><a href="https://github.com/tomymehdi"><img src="https://avatars.githubusercontent.com/u/774112?v=4" width="100px;" alt=""/><br /><sub><b>Tomás Alfredo Mehdi</b></sub></a><br /><a href="https://github.com/vtex-apps/admin-ab-tester/commits?author=tomymehdi" title="Code">💻</a></td>
  </tr>
</table>


<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->

----
