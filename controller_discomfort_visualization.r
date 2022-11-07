library(stringr)
library(ggplot2)
library(dplyr)
library(plotly)
library(hrbrthemes)

#----------------SET ENV-----------------------
# set workspace (set your workspace here)
setwd('C:\\Users\\Laurence Yu\\Documents\\Git Projects\\gamepad-api-dicomfort-measure-demo\\R_visualization\\Objective_measure_visualization\\Discomfort Visualization')


#----------------LOAD DATA-----------------------
# Read text/csv data

#create data frame
cotroller1.df <- read.delim("./data/Controller 1 Mon Nov 07 2022 17_45_17 GMT+0800.txt", header=F)

#split raw values
colnames(cotroller1.df) <- c('raw')
cotroller1.df[c('standard_time', 'timestamp', 'ctrl_timestamp', 'discomfort')] <- str_split_fixed(cotroller1.df$raw, ',', 4)

#deal with timestamp for x-axis
# time_start <- (cotroller1.df$timestamp)[1]

# mutate & recreate x-axis for time(second)
# cotroller1.df <- mutate(cotroller1.df, timestamp_s = as.POSIXct(standard_time, format="%d/%m/%Y %H:%M", tz=Sys.timezone()))

#formate value
cotroller1.df <- mutate(cotroller1.df, discomfort_s = as.double(discomfort))
cotroller1.df <- mutate(cotroller1.df, timestamp_s = as.double(ctrl_timestamp))


cotroller1.df
#----------------Visualization---------------
# Usual area chart
p <- cotroller1.df %>%
  ggplot( aes(x=timestamp_s, y=discomfort_s)) +
  # geom_area(fill="#69b3a2", alpha=0.5) +
  geom_line(color="#69b3a2") +
  ylab("Discomfort") +
  xlab("Timestamp") +
  theme_ipsum()

# Turn it interactive with ggplotly
p <- ggplotly(p)
p

# save the widget
# library(htmlwidgets)
# saveWidget(p, file=paste0( getwd(), "/HtmlWidget/ggplotlyAreachart.html"))