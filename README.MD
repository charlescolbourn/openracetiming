# OpenRaceTiming

## Description
OpenRaceTiming is intended to be a fully open source race timing system with the following features:

* NFC/RFID scanning
* Barcode scanning
* Manual timing
* Import of entry lists from csv (e.g. SIEntries)
* Multi device finish/CP scanning
* Mass start
* Staggered start
* 

## Roadmap

v1.1.0 - Mass start, NFC scanning or tap recording at finish. Import of entrant spreadsheet/manually
  add names. Output of results spreadsheet.

v1.2.0 - Mass start, multi device NFC finish

v1.3.0 - Mass start, multi device NFC checkpoints and finish

v1.4.0 - Observer/results mode. (Possible sls framework API to record times)

## Next Steps

register chip and race number against entry

record time for entry

Export times to csv

That's the simplest useable case (entries can be set up with csv)



## Use Cases

Single device, start race, record times (nfc only)

Multiple device: A starts race and records times; B records tags/race numbers

Multiple device: A starts race; B records times; C records tags/numbers

Multiple device: A starts race and records times; B records tags/numbers; C, D, E are checkpoints

## Services

Recording start(s)

Recording finishes

Recording checkpoints


## Ideas, sensible or wacky

Push/pull times list from timer device to identity device to perform tallying via local networking
instead of online service. 

Link to camera taking photos of finishers to audit finish (trigger camera on phone? external nfc reader?)

EoD - someone taking details and pushing to the API

Drop downs for category & club

## APIs to implement

Upload times

Upload finishers

Upload results

Get times

Get finishers

Get results

Upload entries

