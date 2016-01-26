package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"

	"github.com/jinzhu/gorm"
	_ "github.com/lib/pq"
)

type Record struct {
	Start_t   int
	Stop_t    int
	Server_id string
	Player_a  string
	Player_b  string
	Key       string
	Meta      string
	Count     int
}

func check(msg string, err error) {
	if err != nil {
		fmt.Println("[ " + msg + " ]")
		log.Fatal(err)
	}
}

func insertValues(db *gorm.DB, record []string) {
	// Append quotations for the STRING types
	for i := 0; i <= 7; i++ {
		record[i] = record[i][1:len(record[i])]
	}

	// Convert string records into integers
	start_t, startErr := strconv.Atoi(record[0])
	check("strconv start error", startErr)
	stop_t, stopErr := strconv.Atoi(record[1])
	check("strconv stop error", stopErr)
	count, countErr := strconv.Atoi(record[7])
	check("strconv count error", countErr)

	minecraft := Record{
		Start_t:   start_t,
		Stop_t:    stop_t,
		Server_id: record[2],
		Player_a:  record[3],
		Player_b:  record[4],
		Key:       record[5],
		Meta:      record[6],
		Count:     count,
	}

	db.Create(minecraft)
}

func main() {
	// Open the minecraft dataset
	data, err := os.Open("vedatapak_full.csv")
	check("os.Open error", err)

	// Open database
	db, dbErr := gorm.Open("postgres", "user=askwon dbname=postgres sslmode=disable")
	check("gorm.Open error", dbErr)

	db.DB()
	db.DB().Ping()
	db.DB().SetMaxIdleConns(10)
	db.DB().SetMaxOpenConns(2700000000)

	db.CreateTable(&Record{})

	// Scan the file and using the csv reader to create single records
	reader := csv.NewReader(data)
	for {
		// Read a csv line
		record, readErr := reader.Read()

		// Insert values into database if there is csv data
		if readErr == io.EOF {
			break
		} else if readErr != nil {
			fmt.Println("CSV Reader Error!")
			log.Fatal(readErr)
		} else {
			insertValues(&db, record)
		}
	}
}
