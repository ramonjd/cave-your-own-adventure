# Cave your own adventure

## Development
 - Ensure `WP_DEBUG` use set to `true` in your `wp-config.php`
 - Run `npm run dev`  

## Production
  - Set `WP_DEBUG` to `false` in your `wp-config.php`
  - Run `npm build`

## Plugin
1. Create custom post type: Choose your own adventure master
2. Child pages are chapters in the story
3. Built for Gutenberg: compulsory custom block (always rendered to page) to create decision points to other chapters (this block should show available story points)
4. Somewhere we should warn about orphan pages
5. Somewhere we should show an illustrative layout of the story tree
