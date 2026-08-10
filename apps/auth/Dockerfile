# Use a Node.js runtime as the base image
FROM node:24-alpine

# Install the specific version of npm
RUN npm install -g npm@11.9.0

RUN mkdir -p /auraflux/apps/auth /auraflux/packages/shared-core /auraflux/packages/design-system

# Copy package.json and package-lock.json to the working directory
COPY apps/auth/package*.json ./
COPY packages/shared-core/package*.json /auraflux/packages/shared-core
COPY packages/design-system/package*.json /auraflux/packages/design-system

WORKDIR /auraflux/packages/shared-core
RUN npm install

WORKDIR /auraflux/packages/design-system
RUN npm install

WORKDIR /auraflux/apps/auth
RUN npm install

# Copy the rest of the application code to the working directory
# COPY . .

# Build the application (if necessary - adjust command as needed)
# RUN npm run build

# Expose the port the app runs on
EXPOSE 5173

# Command to run the application
CMD ["npm", "run", "dev"]