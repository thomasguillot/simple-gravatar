# Simple Gravatar

A simple WordPress block to display Gravatar images associated with email addresses.

## Description

Simple Gravatar is a lightweight WordPress block that allows you to easily display Gravatar images in your posts and pages. Simply enter an email address, and the block will display the associated Gravatar image. If no Gravatar is found for the email address, a default avatar will be shown.

## Features

- Simple and intuitive interface
- Customizable image size
- Retina display support
- Fallback to default avatar
- Border customization support
- Duotone filter support
- Multilingual support (English, French, Italian, Spanish, German, Japanese)

## Installation

1. Upload the `simple-gravatar` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Use the block editor to add a Simple Gravatar block to your post or page

## Usage

1. Add a new block to your post or page
2. Search for "Simple Gravatar" in the block inserter
3. Enter an email address in the block settings
4. Adjust the size using the block settings sidebar
5. Customize borders and duotone filters if desired
6. Save or update your post

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Composer (for PHP dependencies)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   composer install
   ```
3. Start development server:
   ```bash
   npm run start
   ```
4. Build for production:
   ```bash
   npm run build
   ```

### Code Quality

The project includes several tools to ensure code quality:

#### JavaScript/React
- Lint: `npm run lint:js`
- Format: `npm run format:js`

#### SCSS
- Lint: `npm run lint:scss`
- Format: `npm run format:scss`

#### PHP
- Lint: `npm run lint:php`
- Fix: `composer lint:fix`

#### Run All Checks
- Lint all: `npm run lint`
- Format all: `npm run format`

### Creating a Release

To create a new release:

```bash
npm run release
```

This will create a zip file in the `release` directory containing all necessary files for distribution.

## License

This project is licensed under the GPL v2 or later.