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

## Use Cases

Single device, start race, record times (nfc or manual)

Multiple device: A starts race and records times; B records tags/race numbers

Multiple device: A starts race; B records times; C records tags/numbers

Multiple device: A starts race and records times; B records tags/numbers; C, D, E are checkpoints

## Services

Recording start(s)

Recording finishes

Recording checkpoints
