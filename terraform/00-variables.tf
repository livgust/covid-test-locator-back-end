variable "name" {
  type    = string
  default = "covid-test-locator"
}

variable "name_alphanumeric" {
  type    = string
  default = "covidtestlocator"
}

variable "env" {
  type    = string
  default = "dev"
}

variable "image_name" {
  type = string
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "container_port" {
  type    = number
  default = 3000
}

variable "domain_name" {
  type    = string
  default = "covidtestcollab.com"
}

variable "google_api_key" {
  type = string
}