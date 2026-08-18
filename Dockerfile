FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* vars into the JS bundle at build time - these must be
# set here, not as a docker-compose runtime environment var, or they have no effect.
ARG VITE_API_URL=https://staging-api.mashesha.co.za
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_PAYSTACK_PUBLIC_KEY=pk_test_abeefc4d2c839f72599ababcb5dddc58132f35a4
ENV VITE_PAYSTACK_PUBLIC_KEY=$VITE_PAYSTACK_PUBLIC_KEY

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
