package main

import (
	"fmt"
	"log"

	"github.com/jinzhu/gorm"
	_ "github.com/lib/pq"
)

type server1 struct {
	Start_t   int
	Stop_t    int
	Server_id string
	Player_a  string
	Player_b  string
	Key       string
	Meta      string
	Count     int
}

type distinct_players1 struct {
	Player_a string
}

type Action struct {
	Count   int
	Details map[string]int
}

type PlayerActions struct {
	action map[string]Action
}

type PlayerStats struct {
	PlayTime int
	Actions  []PlayerActions
}

func check(msg string, err error) {
	if err != nil {
		fmt.Println("[ " + msg + " ]")
		log.Fatal(err)
	}
}

// func insertValues(db *gorm.DB, record []string) {

// 	minecraft := Player {
//         Logged_playtime:
//     }

// 	db.Create(minecraft)
// }

// Minimum of a slice of int arguments
func MaxInArray(v []int) (max int) {
	if len(v) > 0 {
		max = v[0]
	}
	for i := 1; i < len(v); i++ {
		if v[i] > max {
			max = v[i]
		}
	}
	return
}

func main() {
	// Open the minecraft dataset
	// data, err := os.Open("servers/server1.csv")
	// check("os.Open error", err)

	// Open database
	db, dbErr := gorm.Open("postgres", "user=askwon dbname=datacraft sslmode=disable")
	check("gorm.Open error", dbErr)

	db.DB()
	db.DB().Ping()
	db.DB().SetMaxIdleConns(10)
	db.DB().SetMaxOpenConns(2700000000)

	var names []distinct_players1
	db.Find(&names)

	players := make(map[string]PlayerStats)
	for x, name := range names {
		var playerData []server1
		db.Order("start_t").Where("player_a = ?", name.Player_a).Find(&playerData)

		if len(playerData) == 0 {
			continue
		} else if len(playerData) == 1 {
			// Only one entry in player data, so calculate playtime with what's given

			// Gather playtime information
			playTime := playerData[0].Stop_t - playerData[0].Start_t

			// Gather user action information
			// Instantiate the nested actions and details structs
			actions := make([]PlayerActions, 1)
			actions[0].action = make(map[string]Action)
			details := make(map[string]int)

			// Assign information to the actions struct
			details[playerData[0].Meta] = playerData[0].Count
			actions[0].action[playerData[0].Key] = Action{playerData[0].Count, details}

			// Finally add to the player list
			players[name.Player_a] = PlayerStats{playTime, actions}

		} else {
			// Player Data
			playTime := 0
			// actionCount := 0
			actions := make([]PlayerActions, len(playerData))
			intervals := make([]int, len(playerData))
			initialStart_t := playerData[0].Start_t

			for i, info := range playerData {

				// TODO:
				// Gather user action information
				// actionCount += info.Count
				// actions[i] = PlayerAction{info.Key, info.Meta, info.Count}

				// Gather playtime information
				if initialStart_t != info.Start_t {
					playTime += MaxInArray(intervals)
					intervals = make([]int, len(playerData))
					initialStart_t = info.Start_t
				}
				intervals = append(intervals, info.Stop_t-info.Start_t)
				if i == len(playerData)-1 {
					playTime += MaxInArray(intervals)
				}
			}

			// Finally add to the player list
			players[name.Player_a] = PlayerStats{playTime, actions}

			// fmt.Printf("%# v\n", pretty.Formatter(playerData))
			// fmt.Println("- - - - - -")
			// fmt.Printf("%# v\n", pretty.Formatter(players[name.Player_a]))
			// fmt.Println(playTime)

		}

		// if x == 5 {
		// 	os.Exit(0)
		// }

	}

	// fmt.Println(server)

	// db.CreateTable(&Player{})

	// // Scan the file and using the csv reader to create single records
	// count := 0
	// names := make(map[string]bool)
	// stats := make(map[string]bool)
	// reader := csv.NewReader(data)
	// for {
	// 	// Read a csv line
	// 	record, readErr := reader.Read()

	// 	// Insert values into database if there is csv data
	// 	if readErr == io.EOF {
	// 		break
	// 	} else if count == 0 {
	// 		// Ignore csv header
	// 		count++
	// 		continue
	// 	} else if readErr != nil {
	// // Check for other errors
	// 		fmt.Println("CSV Reader Error!")
	// 		log.Fatal(readErr)
	// 	} else {
	// // Accumulate player statistics
	// 		fmt.Println(record)

	// 		if !names[record[3]] {
	// 			names[record[3]] = true
	// 		}

	// 		fmt.Println(names)

	// 		if count == 5 {
	// 			os.Exit(0)
	// 		}
	// 	}

	// 	count++
	// }

	// insertValues(&db, record)
}
