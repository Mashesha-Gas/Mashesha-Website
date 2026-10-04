FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* vars into the JS bundle at build time - these must be
# set here, not as a docker-compose runtime environment var, or they have no effect.
#
# There's no payment key here any more: Yoco's Checkout API is a server-side
# redirect, so the browser never holds a gateway key at all. The Paystack
# publishable key this replaces had to be baked in because its popup ran
# client-side.
ARG VITE_API_URL=https://staging-api.mashesha.co.za
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
