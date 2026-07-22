# Oxyniti website — static site served by nginx
FROM nginx:1.27-alpine

# site-specific nginx config (gzip + cache headers)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# site content
COPY index.html /usr/share/nginx/html/
COPY css/  /usr/share/nginx/html/css/
COPY js/   /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
